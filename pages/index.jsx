
import { useState } from "react"
import { NFTCard } from "./components/nftCard"






const Home = () => {
  const [wallet, setWallet] = useState([])
  const [collection, setCollection] = useState([])
  const [isFetchCollection, setFetchCollection] = useState(false)
  const [NFTs, setNFTs] = useState()

  const fetchNFTs = async (wallet, collection) => {
    let nfts
    console.log("fetching nfts")
    if (!collection.length) {
      nfts = await fetch(`https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs?owner=${wallet}`).then(data => data.json())
    } else {
      console.log("fetching for collection")
      nfts = await fetch(`https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs?owner=${wallet}&contractAddresses%5B%5D=${collection}`).then(data => data.json())
    }
    console.log(nfts)
    if (nfts) setNFTs(nfts.ownedNfts)
    console.log(NFTs)

  }

  const fetchNFTsForCollection = async (collection) => {
    if (collection) {
      const nfts = await fetch(`https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection?contractAddress=${collection}&withMetadata=true`).then(data => data.json())
      if (nfts) {
        console.log(nfts)
        setNFTs(nfts.nfts)
      }
    }
  }
  

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={isFetchCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={e => setWallet(e.target.value)} placeholder="paste wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300" onChange={e => setCollection(e.target.value)} placeholder="paste collection address"></input>
        <label className="text-gray-600 "><input onChange={(e) => { setFetchCollection(e.target.checked) }} className="mr-2" type={"checkbox"}></input>Get collection</label>
        <button onClick={() => {
          if (isFetchCollection) {
            fetchNFTsForCollection(collection)
          } else fetchNFTs(wallet, collection)
        }} className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} >Fetch NFTs</button>

      </div>


      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {
          NFTs &&
          NFTs.map(nft => {
            return <NFTCard nft={nft} />
          })
        }
      </div>
    </div>
  )
}

export default Home
