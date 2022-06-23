* Front-end [MAIN CHANGES]
    - [x] finish/improve msg
    - [x] when game end, block buttons but dont clear board
    - [ ] ...
    - [x] Clean code
    - [X] Fixed page when have 1 or dont have game yet.
        - [x] libs, page and components.
    - [X] Create a button component structure
    - [ ] Improve page structure
        - [ ] "Login" modal, change backgrond or dont relaod page unitl login.
    - [ ] Styles
        - [X] Define gloabl color, size and font (inside 1 file like theme)
        - [X] Styling player component.
        - [ ] Define a font.
        - [ ] Board.
            - [ ] Buttons styles wiht X and O.
            - [ ] Board Background.
        - [ ] Styling modal.
            - [ ] Box.
            - [ ] Input and button.
        - [X] Create a struture, global and clean CSS
        - [X] Finish page structure without beutifull CSS [Desktop first].
        - [X] Create css to componentes like board buttons.
        
* Global
    - [ ] ENV
    - [ ] Setup a deploy/dev structure with docker
        - [ ] Front-end container
        - [ ] Back-end container
    - [ ] Create a CI/CD with test
    
- [ ] (Not important improvements)
    * Front-end
        - [ ] Login input check if is valid.
        - [ ] P1 - Save wins, losses and name on cookies with jwt.
        - [ ] P1 - Change player info to be possible have this information.
        - [ ] P2 - Create a login.
        - [ ] P2 - In case the user not exist able new input to repeat pwd.
    * Back-end 
        - [ ] P1 - Create a end poit to validate this token.
        - [ ] P1 - Use the validate fuction like middlewere on socket connection to validate.
        - [ ] P2 - Create a end point to validate login.
        - [ ] P2 - Create a end point to register[if exist token transfere wins and losses].
    
    * Global
        - [ ] P2 - Create a docker with db.
        - [ ] P2 - Create a DB structure only with user information.

* Phase 2 [ROOMS]
