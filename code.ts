// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".

figma.showUI(__html__);

// Extracts the component name from the top-level object in the selection.
function extractComponentNameFromSelection(): string {
  const selection = figma.currentPage.selection;
  const topLevelObjects = selection.filter(object => object.parent === figma.currentPage);

  if (topLevelObjects.length > 0) {
    figma.currentPage.selection = [topLevelObjects[0]];
    console.log("Selected top-level object:", topLevelObjects[0].name);
    return topLevelObjects[0].name; 
  } else {
    console.log("No top-level objects in the current selection");
    return 'error'; 
  }
}

// Creates a new variable collection with a given component name and returns the collection.
function createVariableCollectionWithComponentName(componentName: string) {
  return figma.variables.createVariableCollection(`${componentName}`);
}

// Processes each variable from the clicked component.
function processComponentVariables(componentName: string, collection: any) {
  const clickedComponentVariables = figma.variables.getLocalVariables('COLOR');
  console.log(clickedComponentVariables);
  clickedComponentVariables.forEach(variable => {
    createAndSetVariable(componentName, variable, collection);
  });
}

// ############ CODE IN DEVELOPMENT ###########

// function createAndSetVariable(componentName: string, variable: any, collection: any) {
//   const variableName = variable.name;

//   // This assumes that variable.id is a valid identifier for your primitive variable.
//   const primitiveVariable = figma.variables.getVariableById(variable.id);

//   const newVariableName = `${componentName}-${variableName}`;
//   const newVariable = figma.variables.createVariable(
//     newVariableName,
//     collection.id,
//     'COLOR'
//   );
//   // Alias the new variable to the original primitive variable
//   if (primitiveVariable !== null) {
//     const variableAlias = figma.variables.createVariableAlias(primitiveVariable);
//     console.log(variableAlias);
//     // newVariable.setValueForMode(newVariable.id, variableAlias);
//   }
//   else {
//   }
//   // The way to assign the alias might need to be refined, as I'm not 100% certain 
//   // of the structure expected by Figma here.
//   }

// ############# WORKING CODE ############
// Creates a new variable for a given component variable and sets its value.
function createAndSetVariable(componentName: string, variable: any, collection: any) {
  const variableName = variable.name;
  const variableStyle = variable.id; // I can't parse this to .setValueForMode
  console.log(variableStyle);
  const newVariableName = `${componentName}-${variableName}`;
  const newVariable = figma.variables.createVariable(
    newVariableName,
    collection.id,
    'COLOR'
  );
  const newCollectionDefaultModeId = collection.modes[0].modeId;
  console.log(newCollectionDefaultModeId); 
  // The setValueForMode has been commented out since it was in the original code.
  // If needed, you can uncomment and adjust as required.
  //newVariable.setValueForMode(newCollectionDefaultModeId, variableStyle);
}

figma.ui.onmessage = msg => {
  const componentName = extractComponentNameFromSelection();
  const collection = createVariableCollectionWithComponentName(componentName);
  processComponentVariables(componentName, collection);
};


// figma.showUI(__html__);


// // Calls to "parent.postMessage" from within the HTML page will trigger this
// // callback. The callback will be passed the "pluginMessage" property of the
// // posted message.
// figma.ui.onmessage = msg => {
  
//   const selection = figma.currentPage.selection;

//   // Filter out only the top-level objects (whose parent is the currentPage)
//   const topLevelObjects = selection.filter(object => object.parent === figma.currentPage);

//   // If there are top-level objects, select the first one
//   let componentName: string ; 
//   if (topLevelObjects.length > 0) {
//     figma.currentPage.selection = [topLevelObjects[0]];
//     console.log("Selected top-level object:", topLevelObjects[0].name);
//     componentName = topLevelObjects[0].name; 
//   } else {
//     console.log("No top-level objects in the current selection");
//     componentName = 'error'; 
//   }

//   let clickedComponentVariables = figma.variables.getLocalVariables('COLOR'); 
//   console.log(clickedComponentVariables);

//   const collection = figma.variables.createVariableCollection(`${componentName}`);

// // Loop through the clickedComponentVariables array
//   clickedComponentVariables.forEach(variable => {
//     // Extract the name property
//     let variableName = variable.name;
//     //let variableStyle: { [modeId: string]: VariableValue; } = variable.valuesByMode;

//     // Create a new variable with the format 'collectionName-variableName'
//     let newVariableName = `${componentName}-${variableName}`;

//     // Use the createVariable method to add the new variable to the 'test' collection
//     const newVariable = figma.variables.createVariable(
//         newVariableName,
//         collection.id,
//         'COLOR'  // Assuming you want to create a STRING type variable. Modify as needed.
//     );

//     const newCollectionDefaultModeId = collection.modes[0].modeId;

//     //newVariable.setValueForMode(newCollectionDefaultModeId, variableStyle); 
//   });
// };




// // NOTE: THIS WAS THE ORIGINAL CODE IN FIGMA.UI.ONMESSAGE
// // One way of distinguishing between different types of messages sent from
//   // your HTML page is to use an object with a "type" property like this.
//   // if (msg.type === 'create-rectangles') {
//   //   const nodes: SceneNode[] = [];
//   //   for (let i = 0; i < msg.count; i++) {
//   //     const rect = figma.createRectangle();
//   //     rect.x = i * 150;
//   //     rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//   //     figma.currentPage.appendChild(rect);
//   //     nodes.push(rect);
//   //   }
//   //   figma.currentPage.selection = nodes;
//   //   figma.viewport.scrollAndZoomIntoView(nodes);
//   // }