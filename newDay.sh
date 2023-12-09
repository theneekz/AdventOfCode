#!/bin/bash
# Make a new folder for a new day with some starting files
read -p 'Day: ' dayNum

mkdir $dayNum
cd $dayNum
cp -a ../../newDayTemplate/ ./
touch input.txt
touch test1.txt
$SHELL
