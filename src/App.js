import React from 'react';

function useResizePanel() {
  let resizableContainerRef = React.useRef(null);
  let resizableDragBarRef = React.useRef(null);
  let resizableRef = React.useRef(null);
  let [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    function handleResize(e) {
      let previousWidth = resizableRef.current.style.width.replace(/\D/g, '');

      previousWidth = parseInt(previousWidth, 10);

      if (isDragging) {
        resizableRef.current.style.width = `${previousWidth + e.movementX}px`;
      }
    }

    function handleResizeStart(e) {
      e.preventDefault();
      setIsDragging(true);
    }

    function handleResizeEnd() {
      if (isDragging) {
        document.removeEventListener('mousemove', handleResize);
        setIsDragging(false);
      }
    }

    resizableDragBarRef.current.addEventListener(
      'mousedown',
      handleResizeStart
    );
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isDragging]);

  return {
    resizableContainerRef,
    resizableDragBarRef,
    resizableRef
  };
}

export default function App() {
  let {
    resizableContainerRef,
    resizableDragBarRef,
    resizableRef
  } = useResizePanel();

  return (
    <section
      ref={resizableContainerRef}
      style={{
        display: 'flex',
        height: 200
      }}
    >
      <aside style={{ width: 300 }} ref={resizableRef}>
        <ul>
          <li>Item a</li>
          <li>Item b</li>
          <li>Item c</li>
        </ul>
      </aside>
      <div
        style={{
          width: 5,
          backgroundColor: 'hsl(210, 83%, 67%)',
          height: '100%',
          cursor: 'col-resize'
        }}
        ref={resizableDragBarRef}
      />
      <article>
        <h2>Heading</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, ex
          quod. Quae distinctio quod dignissimos fugiat hic nisi error ducimus!
          Adipisci qui at eius dolorum libero reiciendis cum culpa quos!
        </p>
      </article>
    </section>
  );
}
