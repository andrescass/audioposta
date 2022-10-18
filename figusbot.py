from telegram.ext import Updater
from bs4 import BeautifulSoup
import requests
from time import sleep

channel_id = '@stock_figus'
TOKEN = "5603274277:AAFvHZp-q-wS5iuy7qIx6N4m39ses98IFK0"

# Getting mode, so we could define run function for local and Heroku setup
#mode = os.getenv("MODE")
mode = "dev"
if mode == "dev":
    def run(updater):
        updater.start_polling()

if __name__ == '__main__':
    """Start the bot."""
    # Create the Updater and pass it your bot's token.
    # Make sure to set use_context=True to use the new context based callbacks
    # Post version 12 this will no longer be necessary
    updater = Updater(TOKEN, use_context=True)

    # Get the dispatcher to register handlers
    dp = updater.dispatcher

    url = 'https://www.zonakids.com/productos/pack-x-25-sobres-de-figuritas-fifa-world-cup-qatar-2022/'

    while True:
        page = requests.get(url)
        soup = BeautifulSoup(page.text, 'lxml')

        meta = soup.find('meta', attrs= {'property': 'tiendanube:stock'})
        if meta['content'] == '0':
            dp.bot.sendMessage(chat_id=channel_id, text="no hay stock")
        else:
            dp.bot.sendMessage(chat_id=channel_id, text="HAY FIGURITAS. CORRÉ! CORRÉ! CORRÉ. Y agadecele a ninjaclan")
        
        sleep(120)


