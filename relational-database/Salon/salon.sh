#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=salon -t -c"

USER_LOGIN() {
  echo -e "\nPhone: "
  read CUSTOMER_PHONE

  CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone='$CUSTOMER_PHONE'")
  if [ -z $CUSTOMER_NAME ]
  then
    echo -e "\nName: "
    read CUSTOMER_NAME

    INSERT=$($PSQL "INSERT INTO customers(name, phone) values ('$CUSTOMER_NAME', '$CUSTOMER_PHONE')")
  fi

  CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")

  echo -e "\nTime: "
  read SERVICE_TIME

  INSERT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) values ($CUSTOMER_ID, $1, '$SERVICE_TIME')")

  SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id=$1")
 
  echo -e "I have put you down for a $SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME."
  
}
MAIN_MENU() {
  SERVICES=$($PSQL "select * from services")

  echo "$SERVICES" | while read SERVICE_ID BAR NAME; do
    echo "$SERVICE_ID) $NAME"
  done
  read SERVICE_ID_SELECTED
  case $SERVICE_ID_SELECTED in
    [1-3]) 
      USER_LOGIN $SERVICE_ID_SELECTED
      ;;
    *) 
      MAIN_MENU
      ;;
  esac
}

MAIN_MENU