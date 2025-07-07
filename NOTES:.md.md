NOTES:

Docker-Compose:
    Nginx reverse proxy.
    The communication between front-end and back end is made through "internet" instead "local". The front-end made requests to backend.tictactoe.com, the request pass through the cloudflare dns that "redirect" to the, in this case same machine, and with the nignx and reverse proxy choose the correct container/app.
    When use request to tictactoe.... the nignx redirect to front end app.