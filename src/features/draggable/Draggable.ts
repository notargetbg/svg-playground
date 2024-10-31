import React, { useState } from 'react';

let dragSrcEl;

const Draggable = ({ type }) => {
    const [active, setActive] = useState(null);
    const items = ['A', 'B', 'C'];

    const activeClass = (item) => {
        return active === item ? 'over' : '';
    };



    const handleDragStart = (e) => {
        e.target.style.opacity = '0.2';

        // DataTransfer
        dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setActive(null);
    };

    const handleDragEnter = (item) => (e) => {
        setActive(item);
    };

    const handleDragLeave = (e) => {
        setActive(null);
    };

    const handleDragOver = (e) => {
        if (e.preventDefault) {
          e.preventDefault();
        }
    
        return false;
    };

    const handleDrop = (e) => {
        
        e.stopPropagation();
        e.preventDefault();

        
        if (type === 'fileDrop') {
            const files = e.dataTransfer.files;
            for (let i = 0, f; f = files[i]; i++) {
              // Read the File objects in this FileList.
              console.log(f);
            }
        }

        if (type === 'elementDrop') {      
            if (dragSrcEl !== e.target) {
                console.log(dragSrcEl);
                dragSrcEl.innerHTML = e.target.innerHTML;
                e.target.innerHTML = e.dataTransfer.getData('text/html');
            }
        }
      
        return false;
    };

    return (
        <div className="container">
            {items.map(item => {
                return (
                    <div
                        key={item}
                        draggable="true"
                        className={`box ${activeClass(item)}`}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragEnter={handleDragEnter(item)}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    )
};

Draggable.defaultProps = {
    type: 'elementDrop'
}

export default Draggable;