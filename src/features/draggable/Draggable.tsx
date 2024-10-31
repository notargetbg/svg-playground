import React, { DragEventHandler, useState } from 'react';

let dragSrcEl: HTMLElement;

interface DraggableProps {
    type: 'elementDrop' | 'fileDrop';
}

const Draggable = ({ type }: DraggableProps) => {
    const [active, setActive] = useState<string | null>(null);
    const items = ['A', 'B', 'C'];

    const activeClass = (item: string) => {
        return active === item ? 'over' : '';
    };

    const handleDragStart: DragEventHandler<HTMLDivElement> = (e) => {
        (e.target as HTMLElement).style.opacity = '0.2';

        // DataTransfer
        dragSrcEl = e.target as HTMLElement;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', (e.target as HTMLElement).innerHTML);
    };

    const handleDragEnd: DragEventHandler<HTMLDivElement> = (e) => {
        (e.target as HTMLElement).style.opacity = '1';
        setActive(null);
    };

    const handleDragEnter = (item: string): DragEventHandler<HTMLDivElement> => (e) => {
        console.log(e);
        setActive(item);
    };

    const handleDragLeave = (): DragEventHandler<HTMLDivElement> => (e) => {
        console.log(e);
        setActive(null);
    };

    const handleDragOver = (): DragEventHandler<HTMLDivElement> => (e) => {
        if (e.preventDefault) {
          e.preventDefault();
        }
    
        return false;
    };

    const handleDrop = (e: any) => {
        
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