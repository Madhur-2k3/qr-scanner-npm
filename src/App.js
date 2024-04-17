

import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';

QrScanner.WORKER_PATH = '/path/to/qr-scanner-worker.min.js';

function MyComponent() {
  const videoRef = useRef(null);
  const [rollno, setRollno] = useState([]); // State variable to store roll number

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      result => {
        console.log('decoded qr code:', result);
        setRollno(prevRollnos=>[...prevRollnos,result.data]); // Save the result in the rollno state variable
      },
      { returnDetailedScanResult: true }
    );

    qrScanner.start();

    return () => {
      qrScanner.destroy();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      {/* <p>Decoded Roll No: {rollno}</p> */}
      <div>
        <h2>Decoded Roll Numbers:</h2>
        <ul>
          {rollno.map((rollno, index) => (
            <li key={index}>{rollno}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MyComponent;

