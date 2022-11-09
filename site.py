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
EVENT = Path("templates/event.html")

# Output
EN = Path("./en")
RUS = Path("./rus")


def iterate_pics(data_dict):
    for fname in chain(GALLERY.glob('*'), GAMES.glob('*'),
                       CHARACTERS.glob('*'), FLAGS.glob('*')):
        if str(fname.parent) not in data_dict:
            data_dict[str(fname.parent)] = {}

        data = open(fname, 'rb').read()
        hash = sha256(data).digest().hex()
        ext = fname.name.split('.')[1]
        name = hash + '.' + ext
        data_dict[str(fname.parent)][fname.name] = "../images/" + name
        yield name, data


def make_images(data):
    if not IMAGES.is_dir():
        mkdir(IMAGES)

    images = {}

    for (name, data) in iterate_pics(data):
        open(IMAGES / name, 'wb').write(data)

    with open("images.json", 'w') as file:
        js.dump(images, file)


def do_english(data):
    for faq in data['strings']['FAQS']:
        if faq['type'] == "generic":
            faq['question'] = faq['questionEn']
            faq['answer'] = faq['answerEn']
        elif faq["type"] == "gamesBrought":
            faq["question"] = faq["questionEn"]
            faq["p1"] = faq["p1En"]
            faq["list"] = faq["listEn"]
            faq["p2"] = faq["p2En"]

    for char in data['strings']['characters']:
        char['name'] = char['nameEn']

    for s in list(data['strings']['site']):
        if s.endswith("En"):
            data['strings']['site'][s[:-2]] = data['strings']['site'][s]

    prices = data['strings']['prices']
    prices['costs'] = prices['costsEn']
    prices['specialOffer'] = prices['specialOfferEn']
    prices['travelCost'] = prices['travelCostEn']
    prices['travelCosts'] = prices['travelCostsEn']
    prices['outsideLondon'] = prices['outsideLondonEn']

    games = data['strings']['games']
    for g in games:
        g['description'] = g['descriptionEn']
        g['name'] = g['nameEn']


def do_russian(data):
    for faq in data['strings']['FAQS']:
        if faq['type'] == "generic":
            faq['question'] = faq['questionRus']
            faq['answer'] = faq['answerRus']
        elif faq["type"] == "gamesBrought":
            faq["question"] = faq["questionRus"]
            faq["p1"] = faq["p1Rus"]
            faq["list"] = faq["listRus"]
            faq["p2"] = faq["p2Rus"]

    for char in data['strings']['characters']:
        char['name'] = char['nameRus']

    for s in list(data['strings']['site']):
        if s.endswith("Rus"):
            data['strings']['site'][s[:-3]] = data['strings']['site'][s]

    prices = data['strings']['prices']
    prices['costs'] = prices['costsRus']
    prices['specialOffer'] = prices['specialOfferRus']
    prices['travelCost'] = prices['travelCostRus']
    prices['travelCosts'] = prices['travelCostsRus']
    prices['outsideLondon'] = prices['outsideLondonRus']

    games = data['strings']['games']
    for g in games:
        g['description'] = g['descriptionRus']
        g['name'] = g['nameRus']


def main():
    data = {}
    data['strings'] = js.load(open("strings6.json"))
    data['images'] = {}
    make_images(data['images'])

    # Images
    for char in data['strings']['characters']:
        char['image'] = data['images']['characters'][char['image']]

    if not EN.is_dir():
        mkdir(EN)

    do_english(data)
    for page in (INDEX, FAQ, PRICES, CHARS_AND_GAMES, PICS_AND_TESTI, CONTACT,
                 EVENT):
        content = Template(filename=str(page)).render(**data)
        with open(EN / page.name, "w") as file:
            file.write(
                HEADER.render(content=content,
                              prefix="/en",
                              current_page=page.name,
                              **data))

    if not RUS.is_dir():
        mkdir(RUS)

    do_russian(data)
    for page in (INDEX, FAQ, PRICES, CHARS_AND_GAMES, PICS_AND_TESTI, CONTACT,
                 EVENT):
        content = Template(filename=str(page)).render(**data)
        with open(RUS / page.name, "w") as file:
            file.write(
                HEADER.render(content=content,
                              prefix="/rus",
                              current_page=page.name,
                              **data))


if __name__ == '__main__':
    main()
