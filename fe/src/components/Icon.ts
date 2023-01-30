export function Icon(attributes: { id?: string; class?: string } = {}) {
    const icon = document.createElement("i");
  
    for (const attribute in attributes) {
      icon.setAttribute(attribute, attributes[attribute]);
    }
  
    return icon;
  }