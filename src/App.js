

// import React, { useRef, useEffect, useState } from 'react';
// import QrScanner from 'qr-scanner';

// QrScanner.WORKER_PATH = '/path/to/qr-scanner-worker.min.js';

// function MyComponent() {
//   const videoRef = useRef(null);
//   const [rollno, setRollno] = useState(new Set()); // State variable to store roll number

//   useEffect(() => {
//     const qrScanner = new QrScanner(
//       videoRef.current,
//       result => {
//         console.log('decoded qr code:', result);
//         setRollno(prevRollnos=>new Set([...prevRollnos,result.data])); // Save the result in the rollno state variable
//       },
//       { returnDetailedScanResult: true }
//     );

//     qrScanner.start();

//     return () => {
//       qrScanner.destroy();
//     };
//   }, []);

//   return (
//     <div>
//       <video ref={videoRef} width="640" height="480" autoPlay></video>
//       {/* <p>Decoded Roll No: {rollno}</p> */}
//       <div>
//         <h2>Decoded Roll Numbers:</h2>
//         <ul>
//           {rollno.map((rollno, index) => (
//             <li key={index}>{rollno}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default MyComponent;

import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';

QrScanner.WORKER_PATH = '/path/to/qr-scanner-worker.min.js';

function MyComponent() {
  const videoRef = useRef(null);
  const [uniqueRollnos, setUniqueRollnos] = useState(new Set()); // State variable to store unique roll numbers

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      result => {
        console.log('decoded qr code:', result);
        setUniqueRollnos(prevRollnos => new Set([...prevRollnos, result.data])); // Add the result to the uniqueRollnos set
      },
      { returnDetailedScanResult: true }
    );

    qrScanner.start();

    return () => {
      qrScanner.destroy();
    };
  }, []);

  // Convert Set to array for rendering
  const uniqueRollnosArray = Array.from(uniqueRollnos).reverse();

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <div>
        <h2>Unique Roll Numbers:</h2>
        <ul>
          {uniqueRollnosArray.map((rollno, index) => (
            <li key={index}>{rollno}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MyComponent;


