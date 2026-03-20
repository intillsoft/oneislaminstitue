const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CourseManagementTable.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStrUnix = `              </motion.div>\n            ))\n          )}\n        </AnimatePresence>\n      </div>`;
const replaceStrUnix = `                  </motion.div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </AnimatePresence>
      </div>
          )}
        </Droppable>
      </DragDropContext>`;

const targetStrWin = `              </motion.div>\r\n            ))\r\n          )}\r\n        </AnimatePresence>\r\n      </div>`;
const replaceStrWin = `                  </motion.div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </AnimatePresence>
      </div>
          )}
        </Droppable>
      </DragDropContext>`;

if (content.includes('</motion.div>\n            ))\n          )}\n        </AnimatePresence>\n      </div>')) {
    content = content.replace(targetStrUnix, replaceStrUnix);
    console.log('DRAG_COURSES OK V3 UNIX');
} else if (content.includes('</motion.div>\r\n            ))\r\n          )}\r\n        </AnimatePresence>\r\n      </div>')) {
    content = content.replace(targetStrWin, replaceStrWin);
    console.log('DRAG_COURSES OK V3 WIN');
} else {
    console.log('TARGET_DRAG_COURSES FAILL V3');
}

fs.writeFileSync(file, content, 'utf8');
