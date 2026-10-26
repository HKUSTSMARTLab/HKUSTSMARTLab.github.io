# AIDP 2026 报名服务上线指南

本文按“现有静态网站 + 独立 HTTPS API”部署。不要把报名数据库放到 Jekyll/GitHub Pages 目录，也不要把任何 secret 写入前端或 Git。

## 1. 推荐架构

```text
访客浏览器
  ├─ 静态 HTML/CSS/JS：现有 Lab Server / GitHub Pages
  └─ /api/aidp2026/*：API 子域名
                         ↓
               Cloudflare（推荐）或 EdgeOne
                         ↓
                    Nginx + HTTPS
                         ↓
              127.0.0.1:8787 Node 服务
                         ↓
             /var/lib/aidp2026-registration
```

- 静态页继续使用仓库现有发布流程。`main` 分支的 GitHub Action 会在 Lab Server 上执行 `git pull` 和 `bundle exec jekyll build`。
- API 需要一个独立子域名，例如 `aidp2026-api.example.org`。请替换成你实际控制 DNS 的域名。
- 现有 Lab Server 若能安装 Node 24、Nginx 并配置 API 子域名，可以复用；否则可使用一台香港/新加坡的小型云服务器。会议规模下 1 vCPU、1–2 GB 内存通常足够作为起步配置。
- `github.io` 不属于你，不能把 GitHub 的 zone 接入自己的 Cloudflare。只需把**自己拥有的 API 子域名**接入 Cloudflare；Turnstile 仍可保护 `hkustsmartlab.github.io` 上的表单。

## 2. 地区验证码规则

生产环境 `CAPTCHA_PROVIDER=auto` 时：

| 访客地区（边缘 IP 地理信息） | 默认验证码 |
|---|---|
| `CN` 中国大陆 | Tencent Captcha |
| `HK`、`MO`、`TW` 及其他已知国家/地区 | Cloudflare Turnstile |
| `XX`、`T1`、未知或边缘不支持 | 回退选择，用户可手动切换 |

Cloudflare 使用 `CF-IPCountry`，EdgeOne 使用 `EO-Client-IPCountry`。Node 只接受 `TRUST_PROXY_IPS` 指定的直接代理节点所传递的地区头。地区信息只用于本次 `/config` 响应，不写入数据库。IP 地理位置是估计值，因此保留下拉框手动切换。

## 3. 准备服务器

1. 安装 Node 24 LTS、Nginx 和 HTTPS 证书工具。
2. 在仓库中先验证：

   ```bash
   cd services/aidp2026-registration
   node --version
   npm test
   ```

3. 创建服务账号和目录（已存在时跳过账号创建）：

   ```bash
   sudo useradd --system --home /nonexistent --shell /usr/sbin/nologin aidp2026
   sudo mkdir -p /opt/hkust-smartlab/services/aidp2026-registration
   sudo mkdir -p /etc/aidp2026 /var/lib/aidp2026-registration
   sudo cp -a package.json server.js src /opt/hkust-smartlab/services/aidp2026-registration/
   sudo chown -R aidp2026:aidp2026 /opt/hkust-smartlab/services/aidp2026-registration /var/lib/aidp2026-registration
   sudo chmod 0700 /var/lib/aidp2026-registration /etc/aidp2026
   ```

生产环境使用 systemd 的 `EnvironmentFile`，无需复制开发用的 `.env`，更不要复制测试数据库。

## 4. 配置生产环境变量

生成独立管理员令牌：

```bash
openssl rand -hex 32
```

编辑 `/etc/aidp2026/registration.env`，仅 root 可读写。下面是一个完整模板；替换域名和密钥，不能保留空值上线：

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=8787
SERVE_STATIC=false
DATA_DIR=/var/lib/aidp2026-registration

REGISTRATION_OPEN=true
POSTER_DEADLINE=2026-11-13T23:59:59+08:00
RETENTION_DAYS=180
PDF_MAX_BYTES=5242880
UPLOAD_TOKEN_TTL_MS=900000
REQUEST_TIMEOUT_MS=120000

# 填写真实静态站 origin；多个 origin 用英文逗号分隔。
ALLOWED_ORIGINS=https://hkustsmartlab.github.io

# Nginx 与 Node 位于同一台服务器。
TRUST_PROXY=1
TRUST_PROXY_IPS=127.0.0.1,::1
GEO_PROVIDER=cloudflare

CAPTCHA_PROVIDER=auto
TURNSTILE_ENABLED=true
TURNSTILE_SITE_KEY=替换为正式site-key
TURNSTILE_SECRET_KEY=替换为正式secret-key
# 这里填写展示表单的网站 hostname，不是 API 子域名。
TURNSTILE_EXPECTED_HOSTNAMES=hkustsmartlab.github.io

TENCENT_CAPTCHA_ENABLED=true
TENCENT_CAPTCHA_APP_ID=替换为CaptchaAppId
TENCENT_CAPTCHA_SECRET_KEY=替换为CaptchaAppSecretKey

# 临时兼容模式：仅使用现有 AppID/AppSecretKey 时选此项。
TENCENT_CAPTCHA_VERIFY_MODE=legacy
TENCENT_ALLOW_LEGACY=true

# 推荐生产模式：有最小权限 CAM 子账号后改用下面三项，并删除 legacy 两项。
# TENCENT_CAPTCHA_VERIFY_MODE=tc3
# TENCENT_SECRET_ID=最小权限子账号SecretId
# TENCENT_SECRET_KEY=最小权限子账号SecretKey

ADMIN_API_TOKEN=
DEBUG_ADMIN_ENABLED=true
DEBUG_ALLOW_CAPTCHA_BYPASS=false
```

注意：

- 生产环境会拒绝公开的 Turnstile 测试密钥和示例管理员令牌。
- 如果静态站还使用自定义域名，把它加入 `ALLOWED_ORIGINS` 和 `TURNSTILE_EXPECTED_HOSTNAMES`，同时加入 Turnstile 控制台 Hostname Management。
- 腾讯 CAM `SecretId/SecretKey` 与验证码 `CaptchaAppId/AppSecretKey` 不是同一组凭据。CAM 子账号只授予所需验证码权限。
- 临时密钥若在聊天、日志或截图中出现过，上线前应轮换。
- `DEBUG_ADMIN_ENABLED=true` 只开启管理员诊断接口，仍需 Bearer token；生产环境不能绕过验证码。

保护配置文件：

```bash
sudo chown root:root /etc/aidp2026/registration.env
sudo chmod 0600 /etc/aidp2026/registration.env
```

## 5. 启动 Node 常驻服务

安装并启动示例 systemd 单元：

```bash
sudo cp deploy/aidp2026-registration.service.example /etc/systemd/system/aidp2026-registration.service
sudo systemctl daemon-reload
sudo systemctl enable --now aidp2026-registration
systemctl status aidp2026-registration
```

检查本地 API：

```bash
curl http://127.0.0.1:8787/api/aidp2026/health
curl http://127.0.0.1:8787/api/aidp2026/config
```

日志：

```bash
journalctl -u aidp2026-registration -n 100 --no-pager
```

现有 GitHub Action **不会**更新 `/opt` 中的 API 代码，也不会重启此服务。以后修改 `services/aidp2026-registration` 后，需要同步 `package.json`、`server.js`、`src/` 到 `/opt`，然后执行：

```bash
sudo systemctl restart aidp2026-registration
```

纯静态 HTML/CSS/JS 更新仍走现有 Jekyll 发布流程。

## 6. 配置 Nginx 和 HTTPS

仓库提供：

- `deploy/nginx.conf.example`
- `deploy/nginx-cloudflare-real-ip.conf.example`

操作要点：

1. 将 API 子域名写入 `server_name`，先配置有效 TLS 证书。
2. 安装 Real IP 配置：

   ```bash
   sudo cp deploy/nginx-cloudflare-real-ip.conf.example /etc/nginx/aidp2026-cloudflare-real-ip.conf
   ```

3. 将 Nginx 配置中的证书路径、域名改成实际值，启用后执行：

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

示例配置让 Nginx 只信任 Cloudflare 公布的网段，使用 `CF-Connecting-IP` 还原访客 IP，再把清洗后的单一 IP 传给 Node。Cloudflare 网段应定期从 <https://www.cloudflare.com/ips/> 更新。

## 7. 配置 Cloudflare

在**拥有 API 子域名的 zone**中：

1. 添加 API 子域名的 A/AAAA 记录。排错期间可先使用 DNS only，源站 HTTPS 验证成功后改为 **Proxied**。
2. SSL/TLS 模式使用 **Full (strict)**，源站证书必须有效且匹配 API 子域名。
3. 打开 **Network → IP Geolocation**，使源站收到 `CF-IPCountry`。生产环境变量对应 `GEO_PROVIDER=cloudflare`。
4. 保持自动 DDoS 防护和 WAF 开启。为两个 POST 路径配置边缘限流，先小流量观察，再按真实报名情况调整。
5. 所有 `/api/aidp2026/*` 绕过缓存；不要把管理员工单、配置或提交响应缓存到边缘。
6. 确认全链路正常后，将源站安全组/防火墙限制为 Cloudflare IP 与必要管理地址，避免绕过边缘直接攻击源站。
7. 观察 Security Events、源站 429/5xx、验证码失败量和重复报名标记。

Cloudflare 的 Turnstile site key/secret key 不是 zone API token，不能用它们自动修改 DNS、WAF 或 DDoS 设置。

## 8. 配置并发布前端

编辑 `conference/aidp2026/assets/registration-config.js`：

```js
window.AIDP_REGISTRATION_CONFIG = {
  apiBase: "https://aidp2026-api.example.org",
};
```

注意：

- 只写 API origin，不要加末尾斜杠或 `/api`。
- 此处不能放任何 secret。
- `ALLOWED_ORIGINS` 必须包含当前静态页的真实 origin。
- 提交并推送 `main` 后，现有 Action 会发布静态页；API 需已先按前述步骤运行。

## 9. 上线验收

### 地区选择（源站本地测试）

Node 只信任配置代理；以下在本机执行可验证规则：

```bash
curl -H 'CF-IPCountry: CN' http://127.0.0.1:8787/api/aidp2026/config
# preferredProvider 应为 tencent

curl -H 'CF-IPCountry: HK' http://127.0.0.1:8787/api/aidp2026/config
# preferredProvider 应为 turnstile
```

通过公网测试时不要依赖手工构造地区头，Cloudflare 会按真实访客 IP 重写它。可分别请大陆和其他地区的测试人员打开页面核对默认选项。

### 真实浏览器验收

1. 检查首页两个按钮分别定位到会议注册与 Poster 表单。
2. 大陆网络默认腾讯验证码，完成一次真实票据和 PDF 上传。
3. 非大陆网络默认 Cloudflare，完成一次真实票据和 PDF 上传。
4. 手动切换另一家验证码，确认仍可使用；分别测试超过 5 MB 和非 PDF 文件均被拒绝。
5. 验证重复点击/网络重试不会产生意外重复记录，并确认两步上传全部完成后才显示成功。
6. 使用管理员接口检查记录、重复标记、CSV 导出和鉴权 PDF 下载。
7. 模拟错误票据、过期票据和 API 不可用，确认均不会伪造成功状态。
8. 确认数据库不在 Web 根目录，备份和恢复流程可用。

腾讯滑块在无头浏览器中可能触发 403 风控，因此不能把自动化加载成功当作真实票据验收；必须用正式域名和真实浏览器完成一次。

## 10. 腾讯 EdgeOne 替代方案

若主要用户在中国大陆，也可把自有静态域名和 API 域名接入 EdgeOne：

1. 用 CNAME 接入 API 子域名，配置 HTTPS 回源、WAF、限流和 DDoS 防护。
2. 在站点全局配置或规则引擎中开启 **客户端 IP 地理位置头部**，名称设为 `EO-Client-IPCountry`。
3. 环境变量改为：

   ```dotenv
   GEO_PROVIDER=edgeone
   GEO_COUNTRY_HEADER=EO-Client-IPCountry
   ```

4. 不要继续加载 Cloudflare 专用 Real IP 配置；按 EdgeOne 官方回源头和可信网段配置真实客户端 IP。
5. EdgeOne 文档目前说明国家解析暂不支持 IPv6；未获得地区时使用回退并允许手动切换。
6. 中国大陆加速可能涉及 ICP 备案，需在上线前确认。

## 11. 运维要求

- 备份 `/var/lib/aidp2026-registration/registrations.sqlite`、WAL 和 `/var/lib/aidp2026-registration/uploads/` 中的 PDF，并定期做恢复演练；优先使用 SQLite 感知的备份方式。
- 主机磁盘和备份都应加密。默认 180 天只清理在线数据库，管理员导出和历史备份需按同一隐私政策另行清理。
- 管理员导出包含个人数据，下载后限制访问并按期删除。
- 更新 API 代码后运行 `npm test` 和 `systemctl restart`；更新静态页后检查浏览器缓存中的 `registration-config.js` 是否为最新版本。
- 发生攻击时在边缘加严规则，不要通过关闭服务端验证码来“恢复服务”。
