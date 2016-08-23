#!/usr/bin/env bash

export LOG_LEVEL=trace

#primary index
export SUBSCRIPTION_ID=
export AUTH_USER=
export AUTH_KEY=

#secondary index
export SECONDARY_ID=
export SECONDARY_AUTH_USER=
export SECONDARY_AUTH_KEY=

echo "SUBSCRIPTION_ID: " $SUBSCRIPTION_ID
echo "AUTH_USER: " $AUTH_USER
echo "AUTH_KEY: " $AUTH_KEY
echo "LOG_LEVEL: " $LOG_LEVEL