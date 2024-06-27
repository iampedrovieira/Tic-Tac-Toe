

Create container wiht back-end
    docker run -it -p 8080:8080 -v ./../back-end/:/home/app node-dev:1.0 bash
Create container wiht front-end
    docker run -it -p 3000:3000 -v ./../front-end/:/home/app node-dev:1.0 bash

Create container wiht back-end for tests
    docker run -it -v ./../back-end/:/home/app node-dev:1.0 bash