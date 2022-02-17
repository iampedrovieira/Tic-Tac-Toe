import { NextPage } from "next";
import PlayerInfo from 'Components/PlayerInfo/PlayerInfo';

const Test: NextPage = () => {
    const dataTeste = [
      {'id':'123123',
        'name':'Teste 1',
        'option':0,
        'wins':0,
        'losses':0
      },
      {'id':'123123',
        'name':'Teste 2',
        'option':1,
        'wins':0,
        'losses':0
      },
      {'id':'123123',
        'name':'Teste 3',
        'option':-1,
        'wins':0,
        'losses':0
      },
      {'id':'123123',
        'name':'Teste 1',
        'option':0,
        'wins':0,
        'losses':0
      },
    ]
    console.log(dataTeste)
    return (
    <div>
      <div>
        Players
      </div>
        {dataTeste.map((player,index)=>{
          return (
            <PlayerInfo key={index} player={player} />
          )
        })}
    </div>
    )
}
export default Test;