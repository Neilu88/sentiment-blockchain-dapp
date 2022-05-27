import React, { useEffect, useState } from "react"
import "./Coin.css"
import { Button } from "web3uikit"
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis"

function Coin({ perc, setPerc, token, setModalToken, setVisible }) {
  const [color, setColor] = useState()
  const contractProcessor = useWeb3ExecuteFunction()
  const { isAuthenticated } = useMoralis()

  useEffect(() => {
    if (perc < 50) {
      setColor("#c43d08")
    } else {
      setColor("green")
    }
  }, [perc])

  async function vote(upDown) {
    let options = {
      contractAddress: "0x1Cc6F585933F06cD863466d541b7b026b6Ea6996",
      functionName: "vote",
      abi: [
        {
          inputs: [
            { internalType: "string", name: "_ticker", type: "string" },
            { internalType: "bool", name: "_vote", type: "bool" },
          ],
          name: "vote",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: {
        _ticker: token,
        _vote: upDown,
      },
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log("Vote Succesful")
      },
      onError: (error) => {
        alert("Error: You Voted Already Or Canceled A Transaction")
      },
    })
  }

  return (
    <>
      <div>
        <div className="token">{token}</div>
        <div className="circle" style={{ boxShadow: `0 0 20px ${color}` }}>
          <div
            className="wave"
            style={{
              marginTop: `${100 - perc}%`,
              boxShadow: `0 0 20px ${color}`,
              backgroundColor: color,
            }}
          ></div>
          <div className="percentage">{perc}%</div>
        </div>

        <div className="votes">
          <Button
            onClick={() => {
              if (isAuthenticated) {
                vote(true)
              } else {
                alert("Authenicate to Vote")
              }
            }}
            text="Up"
            theme="primary"
            type="button"
          />

          <Button
            color="red"
            onClick={() => {
              if (isAuthenticated) {
                vote(false)
              } else {
                alert("Authenicate to Vote")
              }
            }}
            text="Down"
            theme="colored"
            type="button"
          />
        </div>
        <div className="votes">
          <Button
            onClick={() => {
              setModalToken(token)
              setVisible(true)
            }}
            text="INFO"
            theme="translucent"
            type="button"
          />
        </div>
      </div>
    </>
  )
}

export default Coin
