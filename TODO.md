* Front-end [MAIN CHANGES]
    - [x] finish/improve msg
    - [x] when game end, block buttons but dont clear board
    - [ ] ...
    - [x] Clean code
    - [X] Fixed page when have 1 or dont have game yet.
        - [x] libs, page and components.
    - [X] Create a button component structure
    - [X] Improve page structure
        - [X] "Login" modal, change backgrond or dont relaod page unitl login.
    - [ ] Styles
        - [X] Define gloabl color, size and font (inside 1 file like theme)
        - [X] Styling player component.
        - [X] Define a font.
            - [X] Style a title.
            - [X] Define a message and other text.
        - [X] Board.
            - [X] Buttons styles wiht X and O.
            - [X] Board Background.
        - [X] Styling modal.
            - [X] Box.
            - [X] Input and button.
        - [X] Create a struture, global and clean CSS
        - [X] Finish page structure without beutifull CSS [Desktop first].
        - [X] Create css to componentes like board buttons.
        - [X] BUGFIX, when player 2 win, on next game style with same 0 on hover
 * Back-end
    - [X] - Create structure db with prisma.
    - [X] - Create simple api structure with middlewares.
    - [X] - Create first connection to DB.
    - [ ] - Set a limit time to play of 25s per player.    
* Global
    - [X] ENV
    - [X] Setup a deploy/dev structure with docker
        - [X] Front-end container
        - [X] Back-end container
    - [X]Use ENV by docker/docker-compose instead .env file
    - [ ] Create a CI/CD with test
    - [ ] Improve a db postgres container
        - [ ] Migrate db with prisma on deploy (at this moment needed run command on docker cli)
        - [ ] Use volumes and data perseve correctly.
- [ ] (Not important improvements)
    * Front-end
        - [ ] Login input check if is valid.
        - [ ] P1 - Save wins, losses and name on cookies with jwt.
        - [ ] P1 - Change player info to be possible have this information.
        - [ ] P2 - Create a login.
        - [ ] P2 - In case the user not exist able new input to repeat pwd.
    * Back-end 
        - [ ] P1 - Create a end point to validate this token.
        - [ ] P1 - Use the validate fuction like middlewere on socket connection to validate.
        - [ ] P2 - Create a end point to validate login.
        - [ ] P2 - Create a end point to register[if exist token transfere wins and losses].
    * Global
        - [X] P2 - Create a docker with db.
        - [x] P2 - Create a DB structure only with user information.

* Phase 2 [ROOMS]
    * Global
        - [X] Clean code on Connecting Handlers
            -[X] onNewPlayerJoin
            -[X] onUncheck
            -[X] onCheck
        - [X] Clean code on disconnecting Handlers
        - [X] Clean code Models
            - [X] User
            - [X] Room
            - [X] Game
        - [X] Remove old Models
        - [] New Feature(No 'Draw' game)
            - [X] Add new column on Game (next position to remove)
            - [X] Send the first postion when player have 6 plays on board
            - [X] Send this column to Front-end
            - [X] On Fron-end put the postion blinking
            - [X] On Back-end after send the move put the new postion and remove the new column
            
        - [] P2 - Create a DB structure only with user information.
