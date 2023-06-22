#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.
echo "$($PSQL "TRUNCATE TABLE games, teams")"
SAVEDTEAMS=()
cat games.csv | while IFS=',' read YEAR ROUND WINNER OPPONENT WINNERGOALS OPPONENTGOALS; do
  if [ $YEAR != "year" ]
  then
    if ! [[ " ${SAVEDTEAMS[*]} " =~ " $WINNER " ]]; then
      if [[ "$($PSQL "INSERT INTO teams(name) values ('$WINNER')")" == "INSERT 0 1" ]]; then
        SAVEDTEAMS+=($WINNER)
        echo "$WINNER inserted into table teams"
      fi
    fi

    if ! [[ " ${SAVEDTEAMS[*]} " =~ " $OPPONENT " ]]; then
      if [[ "$($PSQL "INSERT INTO teams(name) values ('$OPPONENT')")" == "INSERT 0 1" ]]; then
        SAVEDTEAMS+=($OPPONENT)
        echo "$OPPONENT inserted into table teams"
      fi
    fi

    WINNERID="$($PSQL "SELECT team_id FROM teams where name='$WINNER'")"
    OPPONENTID="$($PSQL "SELECT team_id FROM teams where name='$OPPONENT'")"
     
     if [[ "$($PSQL "INSERT INTO games(year, round, winner_id, opponent_id, winner_goals, opponent_goals) values ($YEAR, '$ROUND', $WINNERID, $OPPONENTID, $WINNERGOALS, $OPPONENTGOALS)")" == "INSERT 0 1" ]]; then
        echo "Game $YEAR $ROUND inserted into table games"
      fi

  fi 
done
