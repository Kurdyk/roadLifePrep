export const colorWear = (wear:number) => {
    /**
     * Associate a wear coefficient to a color for display
     */
    if (wear < 45) {
        return "#32a852"
    } else if (wear < 65) {
        return "#ed8805"
    } else {
        return "#ed050c"
    }
} 