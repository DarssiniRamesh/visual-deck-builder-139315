#!/bin/bash
cd /home/kavia/workspace/code-generation/visual-deck-builder-139315/deck_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

