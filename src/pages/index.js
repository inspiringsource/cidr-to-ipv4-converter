import { useState } from 'react';

export default function Home() {
  const [cidr, setCidr] = useState('');
  const [firstIp, setFirstIp] = useState('');
  const [lastIp, setLastIp] = useState('');

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
  };

  return (
    <div>
      <h1>CIDR to IPv4 Converter</h1>
      <label>
        CIDR:
        <input type="text" value={cidr} onChange={handleCidrChange} />
      </label>
      <br />
      <button onClick={handleConvert}>Convert</button>
      <br />
      <label>
        First IP: <input type="text" value={firstIp} readOnly />
      </label>
      <br />
      <label>
        Last IP: <input type="text" value={lastIp} readOnly />
      </label>
    </div>
  );
}