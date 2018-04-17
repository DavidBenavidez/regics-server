<h1 align="center">
  <br />
  <img src="./assets/logo.png" alt="icon" width="450px" />
  <br/>
  <br/>
  regics
  <br/>
  <img src="https://img.shields.io/badge/status-development-yellow.svg" />
  <img src="https://img.shields.io/badge/node-v8.3.0-green.svg" />
  <img src="https://img.shields.io/badge/express-v^4.16.2-green.svg" />
  <img src="https://img.shields.io/badge/mysql-v^2.15.0-green.svg" />
  <br/>
</h1>
<h4 align="center">An ICS Registration System</h4>

# Server

### CMSC 128 AY 2017-2018 2ND SEMESTER

1. Check if you already have github on your desktop.

  ```
  git --version
  ```
2. If not, install github on your desktop. For linux users here's how:

  ```
  sudo apt-get update
  sudo apt-get install build-essential libssl-dev libcurl4-gnutls-dev libexpat1-dev gettext unzip
  ```
  
  Now you have to set-up git first by entering your credentials at Github
  
  ```
  git config --global user.name "Your Name"
  git config --global user.email "youremail@domain.com"
  ```
  
3. Yay, so you have github now. You can now download a local copy of our repository.
  Go to your favorite place (I recommend use /desktop) first then:
  
  ```
  https://github.com/DavidBenavidez/regics-server
  ```
### Running the server

1. Create the database using yarn.

  ```
  yarn seed
  ```
  then you will be prompted to enter your password.

2. (OPTIONAL/ FOR TESTING) You can populate the database with dummy/fake data.

  ```
  yarn populate
  ```

3. Install the dependencies

  ```
  yarn install
  ```
  again, you will be prompted to enter your password.
  
4. Run the server 
  ```
  yarn start
  ```

### Conventions

1. Now each time you create your module, you create a new branch.
  Do NOT ever push something to master. ALWAYS create a new branch and then do your magic there
  To create a new branch:
  
  ```
  git checkout -b [name_of_your_new_branch]
  ```
2. When you feel like you've done something~ then that can be a COMMIT already.
  Here's an example of a commit.

  ```
  git add .
  git commit -m "Fixed bugs at Profile Page"
  ```
3. You can make as many commits as possible.
  You should push your commits to your branch if you wish to save it.
  
  ```
  git push origin [name_of_your_created_branch]
  ```
  
4. Now if you feel that you're done for your module, then you can now send it for merging!
 Create a pull request from your branch.