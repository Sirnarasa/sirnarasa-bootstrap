---
draft: true
date: {{ .Date }}
title: "{{ replace .TranslationBaseName "-" " " | title }}"
slug: {{ .BaseFileName }}

tags:
    - Python

categories: Pemrograman

image:
    alt: "{{ replace .TranslationBaseName "-" " " | title }}"
    src: https://unsplash.it/720/380?random
    thumblink: https://unsplash.it/320/160?random

description: ""
---