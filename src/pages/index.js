import { useState } from 'react'

export default function Home() {
  const [cidr, setCidr] = useState('')
  const [firstIp, setFirstIp] = useState('')
  const [lastIp, setLastIp] = useState('')
  const [history, setHistory] = useState([])

  const handleCidrChange = (event) => {
    setCidr(event.target.value)
  }

  const handleConvert = () => {
    const parts = cidr.split('/')
    const baseIp = parts[0]
    const maskBits = parseInt(parts[1])

    const baseIpParts = baseIp.split('.').map(Number)
    const baseIpNumber =
      (baseIpParts[0] << 24) |
      (baseIpParts[1] << 16) |
      (baseIpParts[2] << 8) |
      baseIpParts[3]

    const maskNumber = (0xffffffff << (32 - maskBits)) >>> 0
    const firstIpNumber = (baseIpNumber & maskNumber) >>> 0
    const lastIpNumber = (baseIpNumber | ~maskNumber) >>> 0

    const firstIpParts = [
      (firstIpNumber >> 24) & 0xff,
      (firstIpNumber >> 16) & 0xff,
      (firstIpNumber >> 8) & 0xff,
      firstIpNumber & 0xff,
    ]
    const lastIpParts = [
      (lastIpNumber >> 24) & 0xff,
      (lastIpNumber >> 16) & 0xff,
      (lastIpNumber >> 8) & 0xff,
      lastIpNumber & 0xff,
    ]

    setFirstIp(firstIpParts.join('.'))
    setLastIp(lastIpParts.join('.'))

    setHistory([
      ...history,
      { cidr, firstIp: firstIpParts.join('.'), lastIp: lastIpParts.join('.') },
    ])
  }

  return (
    <div>
      <h1 className="text-center mx-auto text-4xl font-bold">CIDR to IPv4 Converter</h1>
      <div className="card w-96 bg-base-100 shadow-xl mx-auto mt-6">
        <div className="card-body items-center">
          <div className="flex flex-col items-center">
            <label className="flex flex-row">
              CIDR:
              <input
                className="input input-bordered input-sm w-full max-w-xs mx-4"
                type="text"
                value={cidr}
                onChange={handleCidrChange}
              />
            </label>
            <br />
            <button className="btn w-24" onClick={handleConvert}>
              Convert
            </button>
          </div>
          <br />
          <h2 className="underline text-2xl p-6">Range:</h2>
          <label>
            First IP: <input type="text" value={firstIp} readOnly />
          </label>
          <br />
          <label>
            Last IP: <input type="text" value={lastIp} readOnly />
          </label>
        </div>
      </div>
      <br />
      {history.length > 0 && (
      <div className="card w-96 bg-base-100 shadow-xl mx-auto mt-6 p-8">
        <div className="card-body items-center">
          <h2 className="underline text-2xl">Recent:</h2>
          {history.map((item, index) => (
            <div key={index}>
              <br />
              <div className='border-4 border-solid border-gray-300 bg-gray-300'>
                <h3 className="text-xl">Record {index + 1}</h3>
                <p>CIDR: {item.cidr}</p>
                <p>First IP: {item.firstIp}</p>
                <p>Last IP: {item.lastIp}</p>
              </div>
            </div>
          ))}
        </div>
    
      </div>  )}
    </div>
  )
}
