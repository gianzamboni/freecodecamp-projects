#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"
RANDOM_NUMBER=$(($RANDOM % 1000 + 1))

echo "Enter your username:"
read USERNAME

USER_DATA=$($PSQL "select games_played, best_game from users where username='$USERNAME'")

if [[ -z $USER_DATA ]]
then
  echo "Welcome, $USERNAME! It looks like this is your first time here."
  INSERT=$($PSQL "insert into users(username) values ('$USERNAME')")
else 
  IFS="|" read -r GAMES BEST <<< "$USER_DATA"
  echo "Welcome back, $USERNAME! You have played $GAMES games, and your best game took $BEST guesses."
fi

echo "Guess the secret number between 1 and 1000:"
read GUESS

NUMBER_REG='^[0-9]*$'
INTENTS=1

while ! [[ $GUESS =~  $NUMBER_REG ]]; do
  echo "That is not an integer, guess again:"
  INTENTS=$(($INTENTS+1))
  read GUESS
done

while [[ $GUESS -ne $RANDOM_NUMBER ]]; do
  if [[ $GUESS =~ '^[0-9]*$' ]];
  then
    echo "That is not an integer, guess again:"
  elif [[ $GUESS -gt $RANDOM_NUMBER ]];
  then
    echo "It's lower than that, guess again:"
  else 
    echo "It's higher than that, guess again:"
  fi
  read GUESS
  while ! [[ $GUESS =~  $NUMBER_REG ]]; do
    echo "That is not an integer, guess again:"
    read GUESS
  done
  INTENTS=$(($INTENTS+1))
done
GAMES=$(($GAMES+1))

if [[ -z $BEST  ||  $BEST -gt $INTENTS ]] 
then
  BEST=$(($INTENTS))
fi

UPDATE=$($PSQL "UPDATE users SET games_played=$GAMES, best_game=$BEST where username='$USERNAME'")
echo "You guessed it in $INTENTS tries. The secret number was $RANDOM_NUMBER. Nice job!"
