#!/bin/bash
echo "Separating PDF"
pdfseparate $1 %d.pdf
echo "PDF Separated."
COUNTER=1
FILES=$2
FILES=$((FILES+1))
ORGPDF=$1
DIRNAME=${ORGPDF%.*}
mkdir ../$DIRNAME

while [  $COUNTER -lt $FILES ]; do
    CURRENTPDF=$COUNTER".pdf"
    CURRENTPNG=$COUNTER".png"
    echo "Processing "$CURRENTPDF
    convert $CURRENTPDF $CURRENTPNG
    rm $CURRENTPDF
    mv $CURRENTPNG "../"$DIRNAME"/"$CURRENTPNG
    let COUNTER=COUNTER+1 
done

tinypng ../$DIRNAME -k DMaX4v3s-q7mjth7gnjTKc9o1jgRGVWV