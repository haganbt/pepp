#!/usr/bin/env bash

export LOG_LEVEL=trace

#primary index
export HASH=
export AUTH_USER=
export AUTH_KEY=

#secondary index
export SECONDARY_HASH=
export SECONDARY_AUTH_USER=
export SECONDARY_AUTH_KEY=

#app specific
export ENRICH_PERCENTAGES=false

echo "Hash: " $HASH
echo "AUTH_USER: " $AUTH_USER
echo "AUTH_KEY: " $AUTH_KEY
echo "LOG_LEVEL: " $LOG_LEVEL
echo "ENRICH_PERCENTAGES: " $ENRICH_PERCENTAGES