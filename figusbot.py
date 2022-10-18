from telegram.ext import Updater
from bs4 import BeautifulSoup
import requests
from time import sleep

channel_id = '@stock_figus'
channel_id_hb = '@hbotfiguhb'
TOKEN = ""

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

    stock = False
    hb = 0

    while True:
        page = requests.get(url)
        soup = BeautifulSoup(page.text, 'lxml')

        meta = soup.find('meta', attrs= {'property': 'tiendanube:stock'})
        if meta['content'] == '0':
            if stock:
                dp.bot.sendMessage(chat_id=channel_id, text="No hay mas stock. Gracias vuelvan prontos")
                stock = False
        else:
            dp.bot.sendMessage(chat_id=channel_id, text="HAY FIGURITAS EN STOCK. Corré que se acaban!")
            stock = True
        
        if hb > 5:
            dp.bot.sendMessage(chat_id=channel_id_hb, text="Estoy vivo, no te preocupes")
            hb = 0
        
        hb += 1
        
        sleep(60)


