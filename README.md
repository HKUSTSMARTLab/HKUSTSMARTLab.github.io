# HKUST SMART lab webpage

First written on 21/05/2024 by Cheng Jin

Last modified on 27/03/2025 by Cheng Jin

If there's any suggestion about our website / any inquiry about further info, don't hesitate to shoot an email to cjinag@connect.ust.hk ! I am still trying to learn website construction, and I am looking forward to hearing from you :)

====================

This website was built using the Fraser Lab website as a template. James Fraser's website is open-source and available on GitHub.

====================

Technologies this website uses:

    Jekyll
    Github Pages
    Twitter Bootstrap 4.4.1

Before pushing changes, please check that they will work on your system first with the plugins included in the Gemfile using the bundler tool (results served at [localhost:4000](localhost:4000)):

    sudo gem install bundler
    bundle install
    bundle exec jekyll serve

To create a conda environment to locally test and host, the following should suffice:

    conda create -n jekyll -c conda-forge rb-jekyll
    conda activate jekyll
    bundle install
    bundle exec jekyll serve
