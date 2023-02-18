import { useState } from 'react';

export default function Home() {
  const [cidr, setCidr] = useState('');
  const [firstIp, setFirstIp] = useState('');
  const [lastIp, setLastIp] = useState('');
  const [history, setHistory] = useState([]);

  const handleCidrChange = (event) => {
    setCidr(event.target.value);
  };

  const handleConvert = () => {
    const parts = cidr.split('/');
    const baseIp = parts[0];
    const maskBits = parseInt(parts[1]);

    const baseIpParts = baseIp.split('.').map(Number);
    const baseIpNumber = (baseIpParts[0] << 24) | (baseIpParts[1] << 16) | (baseIpParts[2] << 8) | baseIpParts[3];

    const maskNumber = (0xffffffff << (32 - maskBits)) >>> 0;
    const firstIpNumber = (baseIpNumber & maskNumber) >>> 0;
    const lastIpNumber = (baseIpNumber | (~maskNumber)) >>> 0;

    const firstIpParts = [(firstIpNumber >> 24) & 0xff, (firstIpNumber >> 16) & 0xff, (firstIpNumber >> 8) & 0xff, firstIpNumber & 0xff];
    const lastIpParts = [(lastIpNumber >> 24) & 0xff, (lastIpNumber >> 16) & 0xff, (lastIpNumber >> 8) & 0xff, lastIpNumber & 0xff];

    setFirstIp(firstIpParts.join('.'));
    setLastIp(lastIpParts.join('.'));

    setHistory([...history, { cidr, firstIp: firstIpParts.join('.'), lastIp: lastIpParts.join('.') }]);
  };

  return (
    <>
      <div>
        <h1>CIDR to IPv4 Converter</h1>
        <div>
        <label>
          CIDR:
          <input type="text" value={cidr} onChange={handleCidrChange} />
        </label>
        
        <button onClick={handleConvert}>Convert</button>
        </div>
        <br />
        <label>
          First IP: <input type="text" value={firstIp} readOnly />
        </label>
        <br />
        <label>
          Last IP: <input type="text" value={lastIp} readOnly />
        </label>
      </div>
      <br />
      {history.length > 0 && (
        <div>
          <h2>Recent records</h2>
          {history.map((item, index) => (
            <div key={index}>
            <br />
              <p>CIDR: {item.cidr}</p>
              <p>First IP: {item.firstIp}</p>
              <p>Last IP: {item.lastIp}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
