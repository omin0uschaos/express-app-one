function userIdToColor(userId) {
    // Simple hash function to convert userId to a numeric hash value
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }

    // Convert hash to a hex color code
    let color = '#';
    for (let i = 0; i < 3; i++) {
        // Extract parts of the hash as color components
        const value = (hash >> (i * 8)) & 0xFF;
        // Convert the value to hex and append to the color string
        // Ensure resulting string is 2 characters long for each color component
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
}
module.exports = { userIdToColor };