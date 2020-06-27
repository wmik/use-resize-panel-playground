import React from 'react';
import './styles.css';

function useResizePanel(props) {
  let config = Object.assign(
    {
      axis: 'x',
      minSize: 0
    },
    props
  );
  let resizableDragBarRef = React.useRef(null);
  let resizableRef = React.useRef(null);
  let [isDragging, setIsDragging] = React.useState(false);
  let styleProperty = config.axis === 'y' ? 'height' : 'width';

  React.useEffect(() => {
    if (config.size) {
      let isNumber = /\d$/.test(config.size);

      // Inline styling takes precedence
      // no need to break this model
      if (resizableRef.current.style[styleProperty] === '') {
        resizableRef.current.style[styleProperty] = `${config.size}${
          isNumber ? 'px' : ''
        }`.trim();
      }
    }
    // Set the width only once if it is defined
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    function handleResize(e) {
      let sizeDelta = config.axis === 'y' ? e.movementY : e.movementX;
      let previousSize = resizableRef.current.style[styleProperty].replace(
        /\D/g,
        ''
      );

      previousSize = parseInt(previousSize, 10);

      let nextSize = previousSize + sizeDelta;

      if (isDragging && nextSize >= config.minSize) {
        resizableRef.current.style[styleProperty] = `${nextSize}px`;
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

    let currentResizableDragBarRef = resizableDragBarRef.current;

    currentResizableDragBarRef.addEventListener('mousedown', handleResizeStart);
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);

    return () => {
      currentResizableDragBarRef.removeEventListener(
        'mousedown',
        handleResizeStart
      );
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isDragging, config, styleProperty]);

  return {
    resizableDragBarRef,
    resizableRef,
    isDragging
  };
}

export function HorizontalResize() {
  let { resizableDragBarRef, resizableRef, isDragging } = useResizePanel({
    minSize: 200,
    size: 400
  });

  return (
    <React.Fragment>
      <section
        style={{
          display: 'flex',
          height: 200
        }}
      >
        <aside
          style={{ width: 300, backgroundColor: 'hsl(210, 23%, 90%)' }}
          ref={resizableRef}
        >
          <ul>
            <li>Item a</li>
            <li>Item b</li>
            <li>Item c</li>
          </ul>
        </aside>
        <div
          className="resizable-drag-bar"
          style={{
            width: 5,
            backgroundColor: 'hsl(210, 83%, 67%)',
            height: '100%',
            cursor: 'col-resize'
          }}
          ref={resizableDragBarRef}
        />
        <article style={{ padding: '0 8px' }}>
          <h2>Heading</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, ex
            quod. Quae distinctio quod dignissimos fugiat hic nisi error
            ducimus! Adipisci qui at eius dolorum libero reiciendis cum culpa
            quos!
          </p>
        </article>
      </section>
      <pre
        style={{
          padding: 8,
          backgroundColor: 'hsl(210, 20%, 96%)'
        }}
      >
        <code>{JSON.stringify({ isDragging }, null, 2)}</code>
      </pre>
    </React.Fragment>
  );
}

export function VerticalResizeApp() {
  let { resizableDragBarRef, resizableRef, isDragging } = useResizePanel({
    minSize: 100,
    size: 150,
    axis: 'y'
  });

  return (
    <React.Fragment>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <aside
          style={{ width: '100%', backgroundColor: 'hsl(210, 23%, 90%)' }}
          ref={resizableRef}
        >
          <ul>
            <li>Item a</li>
            <li>Item b</li>
            <li>Item c</li>
          </ul>
        </aside>
        <div
          className="resizable-drag-bar"
          style={{
            width: '100%',
            backgroundColor: 'hsl(210, 83%, 67%)',
            height: 5,
            cursor: 'row-resize'
          }}
          ref={resizableDragBarRef}
        />
        <article style={{ padding: '0 8px' }}>
          <h2>Heading</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, ex
            quod. Quae distinctio quod dignissimos fugiat hic nisi error
            ducimus! Adipisci qui at eius dolorum libero reiciendis cum culpa
            quos!
          </p>
        </article>
      </section>
      <pre
        style={{
          padding: 8,
          backgroundColor: 'hsl(210, 20%, 96%)'
        }}
      >
        <code>{JSON.stringify({ isDragging }, null, 2)}</code>
      </pre>
    </React.Fragment>
  );
}

export default function App() {
  return (
    <React.Fragment>
      <h2>Horizontal resize</h2>
      <HorizontalResize />
      <br />
      <h2>Vertical resize</h2>
      <VerticalResizeApp />
    </React.Fragment>
  );
}
