// Returns the AppIcon file as an SVG element
export function getAppIcon(height?, width?, className?) {
    if (height === void 0) { height = 32; }
    if (width === void 0) { width = 32; }
    // Get the icon element
    var elDiv = document.createElement("div");
    elDiv.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' viewBox='0 0 2048 2048'><path d='M2048 512v896q0 53-20 99t-55 81-82 55-99 21H249q-51 0-96-20t-79-53-54-79-20-97V256h1792v256h256zm-128 128h-128v704q0 26-19 45t-45 19q-26 0-45-19t-19-45V384H128v1031q0 25 9 47t26 38 39 26 47 10h1543q27 0 50-10t40-27 28-41 10-50V640zm-384 0H256V512h1280v128zm0 768h-512v-128h512v128zm0-256h-512v-128h512v128zm0-256h-512V768h512v128zm-640 512H256V765h640v643zm-512-128h384V893H384v387z'></path></svg>";
    var icon = elDiv.firstChild as SVGImageElement;
    if (icon) {
        // See if a class name exists
        if (className) {
            // Parse the class names
            var classNames = className.split(' ');
            for (var i = 0; i < classNames.length; i++) {
                // Add the class name
                icon.classList.add(classNames[i]);
            }
        } else {
            icon.classList.add("app-brand");
        }
        // Set the height/width
        height ? icon.setAttribute("height", (height).toString()) : null;
        width ? icon.setAttribute("width", (width).toString()) : null;
        // Update the styling
        icon.style.pointerEvents = "none";
        // Support for IE
        icon.setAttribute("focusable", "false");
    }
    // Return the icon
    return icon;
}