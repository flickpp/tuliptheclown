#!/usr/bin/env python3

import json as js
from itertools import chain
from os import mkdir
from pathlib import Path
from hashlib import sha256

import mako as mk
from mako.template import Template

IMAGES = Path("images")
GALLERY = Path("gallery")
GAMES = Path("games")
CHARACTERS = Path("characters")
FLAGS = Path("flags")

# Templates
HEADER = Template(filename="templates/header.html")
INDEX = Path("templates/index.html")
PRICES = Path("templates/prices.html")
CHARS_AND_GAMES = Path("templates/characters_and_games.html")
PICS_AND_TESTI = Path("templates/partypics_and_testimonials.html")
CONTACT = Path("templates/contact.html")
FAQ = Path("templates/faq.html")

# Output
EN = Path("./en")


def iterate_pics(data_dict):
    for fname in chain(GALLERY.glob('*'), GAMES.glob('*'), CHARACTERS.glob('*'), FLAGS.glob('*')):
        if str(fname.parent) not in data_dict:
            data_dict[str(fname.parent)] = {}

        data = open(fname, 'rb').read()
        hash = sha256(data).digest().hex()
        ext = fname.name.split('.')[1]
        name = hash + '.' + ext
        data_dict[str(fname.parent)][fname.name] = "images/" + name
        yield name, data
            

def make_images(data):
    if not IMAGES.is_dir():
        mkdir(IMAGES)

    images = {}

    for (name, data) in iterate_pics(data):
        open(IMAGES / name, 'wb').write(data)

    with open("images.json", 'w') as file:
        js.dump(images, file)


def make_css():
    with open("style.css", 'rb') as file:
        css = file.read()
        digest = sha256(css).digest().hex()

    name = "style_" + digest[:12] + '.css'

    open(name, 'wb').write(css)
    return name


def main():
    data = {}
    data['strings'] = js.load(open("strings.json"))
    data['images'] = {}
    make_images(data['images'])

    # CSS
    data['css'] = make_css()

    for char in data['strings']['characters']:
        char['image'] = data['images']['characters'][char['image']]

    if not EN.is_dir():
        mkdir(EN)

    for page in (INDEX, FAQ, PRICES, CHARS_AND_GAMES, PICS_AND_TESTI, CONTACT):
        content = Template(filename=str(page)).render(**data)
        with open(EN / page.name, "w") as file:
            file.write(HEADER.render(content=content, **data))

if __name__ == '__main__':
    main()
