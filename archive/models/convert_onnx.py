import torch
import torch.nn as nn
from functools import partial
from timm.models.layers import DropPath
import os

# --- Model Definition (Configured for LiteFM) ---

class PatchEmbedding(nn.Module):
    def __init__(self, img_size, patch_size, in_chans, embed_dim):
        super(PatchEmbedding, self).__init__()
        self.img_size = img_size
        self.patch_size = patch_size
        self.num_patches = (img_size // patch_size) ** 2
        self.proj = nn.Conv2d(in_chans, embed_dim, kernel_size=patch_size, stride=patch_size)

    def forward(self, x):
        x = self.proj(x)
        x = x.flatten(2).transpose(1, 2)
        return x


class Attention(nn.Module):
    def __init__(self, dim, num_heads, qkv_bias=True, attn_drop=0., proj_drop=0.):
        super(Attention, self).__init__()
        self.num_heads = num_heads
        self.head_dim = dim // num_heads
        self.scale = self.head_dim ** -0.5
        self.proj_q = nn.Linear(dim, dim, bias=qkv_bias)
        self.proj_k = nn.Linear(dim, dim, bias=qkv_bias)
        self.proj_v = nn.Linear(dim, dim, bias=qkv_bias)
        self.attn_drop = nn.Dropout(attn_drop)
        self.proj = nn.Linear(dim, dim)
        self.proj_drop = nn.Dropout(proj_drop)

    def forward(self, x):
        B, N, C = x.shape
        q = self.proj_q(x).reshape(B, N, self.num_heads, self.head_dim).permute(0, 2, 1, 3)
        k = self.proj_k(x).reshape(B, N, self.num_heads, self.head_dim).permute(0, 2, 1, 3)
        v = self.proj_v(x).reshape(B, N, self.num_heads, self.head_dim).permute(0, 2, 1, 3)
        attn = (q @ k.transpose(-2, -1)) * self.scale
        attn = attn.softmax(dim=-1)
        x = (attn @ v).transpose(1, 2).reshape(B, N, C)
        x = self.proj(x)
        return x


class MLP(nn.Module):
    def __init__(self, in_features, hidden_features=None, out_features=None, act_layer=nn.GELU, drop=0.):
        super(MLP, self).__init__()
        out_features = out_features or in_features
        hidden_features = hidden_features or in_features
        self.fc1 = nn.Linear(in_features, hidden_features)
        self.act = act_layer()
        self.fc2 = nn.Linear(hidden_features, out_features)
        self.drop = nn.Dropout(drop)

    def forward(self, x):
        x = self.fc1(x)
        x = self.act(x)
        x = self.drop(x)
        x = self.fc2(x)
        x = self.drop(x)
        return x


class TransformerBlock(nn.Module):
    def __init__(self, dim, num_heads, mlp_ratio=4., qkv_bias=True, drop=0., attn_drop=0., drop_path=0.,
                 act_layer=nn.GELU, norm_layer=nn.LayerNorm):
        super(TransformerBlock, self).__init__()
        self.norm1 = norm_layer(dim)
        self.attn = Attention(dim, num_heads, qkv_bias, attn_drop, drop)
        self.drop_path = DropPath(drop_path) if drop_path > 0. else nn.Identity()
        self.norm2 = norm_layer(dim)
        self.mlp = MLP(in_features=dim, hidden_features=int(dim * mlp_ratio), act_layer=act_layer, drop=drop)

    def forward(self, x):
        x = x + self.drop_path(self.attn(self.norm1(x)))
        x = x + self.drop_path(self.mlp(self.norm2(x)))
        return x


class VisionTransformer(nn.Module):
    """Full VisionTransformer for complete inference."""
    def __init__(self, img_size=224, patch_size=16, in_chans=3, proj_dim=0, embed_dim=768, depth=12,
                 num_heads=12, mlp_ratio=4., qkv_bias=True, drop_rate=0., attn_drop_rate=0., drop_path_rate=0.,
                 norm_layer=partial(nn.LayerNorm, eps=1e-6)):
        super(VisionTransformer, self).__init__()
        self.proj_dim = proj_dim
        self.embed_dim = embed_dim
        self.depth = depth
        self.patch_embed = PatchEmbedding(img_size, patch_size, in_chans, embed_dim)
        self.cls_token = nn.Parameter(torch.zeros(1, 1, embed_dim))
        self.pos_embed = nn.Parameter(torch.zeros(1, self.patch_embed.num_patches + 1, embed_dim))
        self.pos_drop = nn.Dropout(p=drop_rate)

        dpr = [x.item() for x in torch.linspace(0, drop_path_rate, depth)]
        self.blocks = nn.ModuleList([
            TransformerBlock(
                dim=embed_dim, num_heads=num_heads, mlp_ratio=mlp_ratio, qkv_bias=qkv_bias,
                drop=drop_rate, attn_drop=attn_drop_rate, drop_path=dpr[i], norm_layer=norm_layer
            )
            for i in range(depth)
        ])
        self.norm = norm_layer(embed_dim)

        if proj_dim == 0:
            self.head = nn.Identity()
        else:
            self.head = nn.Sequential(nn.Linear(embed_dim, proj_dim),
                                      nn.GELU(),
                                      norm_layer(proj_dim))

    def forward(self, x):
        B = x.shape[0]
        x = self.patch_embed(x)
        cls_tokens = self.cls_token.expand(B, -1, -1)
        x = torch.cat((cls_tokens, x), dim=1)
        x = x + self.pos_embed
        x = self.pos_drop(x)
        for blk in self.blocks:
            x = blk(x)
        x = self.norm(x)
        x = self.head(x[:, 0])
        return x


class LiteFMPre(nn.Module):
    """Pre-stage: image → intermediate embedding [B, 197, embed_dim] after block 0."""
    def __init__(self, full_model, block_idx=0):
        super(LiteFMPre, self).__init__()
        self.patch_embed = full_model.patch_embed
        self.cls_token = full_model.cls_token
        self.pos_embed = full_model.pos_embed
        self.pos_drop = full_model.pos_drop
        self.blocks = nn.ModuleList(full_model.blocks[:block_idx + 1])

    def forward(self, x):
        B = x.shape[0]
        x = self.patch_embed(x)
        cls_tokens = self.cls_token.expand(B, -1, -1)
        x = torch.cat((cls_tokens, x), dim=1)
        x = x + self.pos_embed
        x = self.pos_drop(x)
        for blk in self.blocks:
            x = blk(x)
        return x  # [B, 197, embed_dim]


class LiteFMPost(nn.Module):
    """Post-stage: intermediate embedding [B, 197, embed_dim] → final features [B, proj_dim]."""
    def __init__(self, full_model, block_idx=0):
        super(LiteFMPost, self).__init__()
        self.blocks = nn.ModuleList(full_model.blocks[block_idx + 1:])
        self.norm = full_model.norm
        self.head = full_model.head

    def forward(self, x):
        for blk in self.blocks:
            x = blk(x)
        x = self.norm(x)
        x = self.head(x[:, 0])
        return x  # [B, proj_dim]


class AdaPatchSelector(nn.Module):
    """APS model for patch scoring."""
    def __init__(self, in_dim=768, out_dim=1):
        super(AdaPatchSelector, self).__init__()
        self.score_net = nn.Sequential(
            nn.Linear(in_dim, 512),
            nn.ReLU(),
            nn.Dropout(0.25),
            nn.Linear(512, 128),
            nn.Tanh(),
            nn.Linear(128, out_dim),
        )

    def forward(self, x):
        return self.score_net(x)


class DAttention(nn.Module):
    """ABMIL classifier."""
    def __init__(self, n_classes, dropout=0.25, act="relu", n_features=1024):
        super(DAttention, self).__init__()
        self.L = 512
        self.D = 128
        self.K = 1
        self.feature = nn.Sequential(
            nn.Linear(n_features, 512),
            nn.ReLU() if act.lower() == "relu" else nn.GELU(),
            nn.Dropout(dropout) if dropout else nn.Identity()
        )
        self.attention = nn.Sequential(nn.Linear(self.L, self.D), nn.Tanh(), nn.Linear(self.D, self.K))
        self.classifier = nn.Sequential(nn.Linear(self.L * self.K, n_classes))

    def forward(self, x):
        # x: [N, n_features]
        feature = self.feature(x)  # [N, 512]
        A = self.attention(feature)  # [N, 1]
        A = A.transpose(-1, -2)  # [1, N]
        A = torch.softmax(A, dim=-1)
        M = torch.mm(A, feature)  # [1, 512]
        logits = self.classifier(M)  # [1, n_classes]
        return logits


def convert_all():
    """Convert all models to ONNX format."""
    model_path = "/jhcnas3/Pathology/code/PrePath/models/ckpts/LiteFM.pth"
    output_dir = "/home/amax/Public/HKUSTSMARTLab.github.io/showcase/LitePath/ckpts/FM"

    # Model config for litepath-l (embed_dim=384, proj_dim=1024)
    embed_dim = 384
    num_heads = 6
    proj_dim = 1024
    block_idx = 0  # Split after block 0

    print(f"Loading {model_path}...")
    state_dict = torch.load(model_path, map_location='cpu')

    # Build full model
    full_model = VisionTransformer(
        img_size=224, patch_size=16, embed_dim=embed_dim, depth=12, num_heads=num_heads,
        mlp_ratio=4, qkv_bias=True, norm_layer=partial(nn.LayerNorm, eps=1e-6), proj_dim=proj_dim
    )
    msg = full_model.load_state_dict(state_dict, strict=False)
    print(f"Load state dict: {msg}")
    full_model.eval()

    os.makedirs(output_dir, exist_ok=True)

    # 1. Export LiteFM_pre: [B, 3, 224, 224] → [B, 197, 384]
    print("\n=== Exporting LiteFM_pre.onnx ===")
    pre_model = LiteFMPre(full_model, block_idx=block_idx)
    pre_model.eval()
    dummy_input = torch.randn(1, 3, 224, 224)
    pre_output_path = os.path.join(output_dir, "LiteFM_pre.onnx")

    torch.onnx.export(
        pre_model, dummy_input, pre_output_path,
        input_names=['input'], output_names=['embedding'],
        dynamic_axes={'input': {0: 'batch'}, 'embedding': {0: 'batch'}},
        opset_version=14, dynamo=False
    )
    print(f"  Output: {pre_output_path}")
    print(f"  Size: {os.path.getsize(pre_output_path) / 1024 / 1024:.2f} MB")

    # Verify
    with torch.no_grad():
        test_out = pre_model(dummy_input)
        print(f"  Shape: {test_out.shape}")  # Should be [1, 197, 384]

    # 2. Export LiteFM_post: [B, 197, 384] → [B, 1024]
    print("\n=== Exporting LiteFM_post.onnx ===")
    post_model = LiteFMPost(full_model, block_idx=block_idx)
    post_model.eval()
    dummy_embedding = torch.randn(1, 197, embed_dim)
    post_output_path = os.path.join(output_dir, "LiteFM_post.onnx")

    torch.onnx.export(
        post_model, dummy_embedding, post_output_path,
        input_names=['embedding'], output_names=['features'],
        dynamic_axes={'embedding': {0: 'batch'}, 'features': {0: 'batch'}},
        opset_version=14, dynamo=False
    )
    print(f"  Output: {post_output_path}")
    print(f"  Size: {os.path.getsize(post_output_path) / 1024 / 1024:.2f} MB")

    # Verify
    with torch.no_grad():
        test_out = post_model(dummy_embedding)
        print(f"  Shape: {test_out.shape}")  # Should be [1, 1024]

    # 3. Export full LiteFM (for reference/fallback)
    print("\n=== Exporting LiteFM.onnx (full) ===")
    full_output_path = os.path.join(output_dir, "LiteFM.onnx")
    dummy_input = torch.randn(1, 3, 224, 224)

    torch.onnx.export(
        full_model, dummy_input, full_output_path,
        input_names=['input'], output_names=['output'],
        dynamic_axes={'input': {0: 'batch'}, 'output': {0: 'batch'}},
        opset_version=14, dynamo=False
    )
    print(f"  Output: {full_output_path}")
    print(f"  Size: {os.path.getsize(full_output_path) / 1024 / 1024:.2f} MB")


def convert_mil_aps():
    """Convert MIL and APS models to ONNX."""
    base_dir = "/home/amax/Public/HKUSTSMARTLab.github.io/showcase/LitePath/ckpts/MIL"
    tasks = ['Lung-NSCLC', 'Gastric-Grade', 'TNM']

    # APS config: input = cls_token + patch_mean = 384 * 2 = 768
    aps_in_dim = 768
    mil_in_dim = 1024
    n_classes = 2

    for task in tasks:
        demo_dir = os.path.join(base_dir, "demo_cases", task)

        # Find checkpoint files
        mil_ckpt = None
        aps_ckpt = os.path.join(demo_dir, "aps_model_best.pth.tar")
        for f in os.listdir(demo_dir):
            if f.startswith("model_best") and f.endswith(".pth.tar"):
                mil_ckpt = os.path.join(demo_dir, f)
                break

        print(f"\n=== Converting {task} ===")

        # Convert MIL
        if mil_ckpt and os.path.exists(mil_ckpt):
            print(f"  Loading MIL from {mil_ckpt}")
            mil_model = DAttention(n_classes=n_classes, n_features=mil_in_dim)
            ckpt = torch.load(mil_ckpt, map_location='cpu', weights_only=False)
            mil_model.load_state_dict(ckpt['state_dict'])
            mil_model.eval()

            mil_output = os.path.join(base_dir, f"{task}.onnx")
            dummy_features = torch.randn(100, mil_in_dim)  # N patches

            torch.onnx.export(
                mil_model, dummy_features, mil_output,
                input_names=['features'], output_names=['logits'],
                dynamic_axes={'features': {0: 'num_patches'}},
                opset_version=14, dynamo=False
            )
            print(f"  MIL exported: {mil_output}")

        # Convert APS
        if os.path.exists(aps_ckpt):
            print(f"  Loading APS from {aps_ckpt}")
            aps_model = AdaPatchSelector(in_dim=aps_in_dim, out_dim=1)
            ckpt = torch.load(aps_ckpt, map_location='cpu', weights_only=False)
            aps_model.load_state_dict(ckpt['state_dict'])
            aps_model.eval()

            aps_output = os.path.join(base_dir, f"{task}_APS.onnx")
            dummy_aps_input = torch.randn(100, aps_in_dim)  # N patches, 768 dim

            torch.onnx.export(
                aps_model, dummy_aps_input, aps_output,
                input_names=['features'], output_names=['scores'],
                dynamic_axes={'features': {0: 'num_patches'}, 'scores': {0: 'num_patches'}},
                opset_version=14, dynamo=False
            )
            print(f"  APS exported: {aps_output}")


def verify_models():
    """Verify all ONNX models."""
    import onnxruntime as ort

    fm_dir = "/home/amax/Public/HKUSTSMARTLab.github.io/showcase/LitePath/ckpts/FM"
    mil_dir = "/home/amax/Public/HKUSTSMARTLab.github.io/showcase/LitePath/ckpts/MIL"

    print("\n=== Verifying ONNX Models ===")

    # LiteFM_pre
    pre_path = os.path.join(fm_dir, "LiteFM_pre.onnx")
    if os.path.exists(pre_path):
        sess = ort.InferenceSession(pre_path)
        inp = sess.get_inputs()[0]
        out = sess.get_outputs()[0]
        print(f"LiteFM_pre: {inp.name} {inp.shape} → {out.name} {out.shape}")

    # LiteFM_post
    post_path = os.path.join(fm_dir, "LiteFM_post.onnx")
    if os.path.exists(post_path):
        sess = ort.InferenceSession(post_path)
        inp = sess.get_inputs()[0]
        out = sess.get_outputs()[0]
        print(f"LiteFM_post: {inp.name} {inp.shape} → {out.name} {out.shape}")

    # MIL & APS
    for task in ['Lung-NSCLC', 'Gastric-Grade', 'TNM']:
        mil_path = os.path.join(mil_dir, f"{task}.onnx")
        aps_path = os.path.join(mil_dir, f"{task}_APS.onnx")

        if os.path.exists(mil_path):
            sess = ort.InferenceSession(mil_path)
            inp = sess.get_inputs()[0]
            out = sess.get_outputs()[0]
            print(f"{task} MIL: {inp.name} {inp.shape} → {out.name} {out.shape}")

        if os.path.exists(aps_path):
            sess = ort.InferenceSession(aps_path)
            inp = sess.get_inputs()[0]
            out = sess.get_outputs()[0]
            print(f"{task} APS: {inp.name} {inp.shape} → {out.name} {out.shape}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == "fm":
            convert_all()
        elif sys.argv[1] == "mil":
            convert_mil_aps()
        elif sys.argv[1] == "verify":
            verify_models()
        else:
            print("Usage: python convert_onnx.py [fm|mil|verify]")
    else:
        convert_all()
        convert_mil_aps()
        verify_models()
