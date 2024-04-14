 export function roll(): number {
    const qualityIndex = Math.floor(Math.random() * 20);
    console.log('Roll Result: ', qualityIndex);
    if (qualityIndex === 1) {
        // get random 5*, return index of such rarity
        return 5;
    }
    else if (qualityIndex > 1 && qualityIndex <= 7) {
        // get random 4* " "
        return 4;
    }
    else {
        return 3;
    }
 }