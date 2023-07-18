if [ -z $1 ]
then
  echo "Please provide an element as an argument."
else 
  PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"

  QUERY="select * from  elements join properties using(atomic_number) join types using(type_id) where"
  NUMBER_REG='^[0-9]+$'
  if [[ $1 =~ $NUMBER_REG ]]
  then
  QUERY="$QUERY atomic_number=$1"
  else
  QUERY="$QUERY name='$1' or symbol='$1'"
  fi
  ELEMENT=$($PSQL "$QUERY;")

  if [ -z $ELEMENT ] 
  then
    echo "I could not find that element in the database."
  else 
    IFS="|" read -r NUMBER SYMBOL NAME MASS MELT BOIL TYPE_ID TYPE <<< "$ELEMENT"
    echo -e "The element with atomic number $NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $MASS amu. $NAME has a melting point of $MELT celsius and a boiling point of $BOIL celsius."
  fi
fi
