import { Icon, Typography } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useEffect, useMemo, useRef, useState } from "react";

const ID = 'X18uNSRXyxYLHnIWiRbPR0vx';
const SECRET = '2jBZTHwbWitytWll4Mu7CSJLB0X5fW0lu_d2rLrCHpZ-BXgl';

const upwardArrow = <ArrowUpwardIcon color="success" />;
const downwardArrow = <ArrowDownwardIcon color="error" />;

export const MainPage = () => {
  const [data, setData] = useState<any>(null);
  const socket = useRef<WebSocket | null>(null);
  const [prevData, setPrevData] = useState<any>(null);
  
  useEffect(() => {
    socket.current = new WebSocket(`wss://ws.bitmex.com/realtime?api_token=${ID}`);

    const obj = { op: "subscribe", args: ["instrument:ETHUSD"] };

    sendDataToSocket(JSON.stringify(obj));

    gettingData();
  }, [socket]);

  const sendDataToSocket = (message: string) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current?.send(message);
    } else {
      setTimeout(() => sendDataToSocket(message), 1000);
    }
  };

  const gettingData = () => {
    if (!socket.current) return;

    socket.current.onmessage = (event) => {
      const socketData = JSON.parse(event.data).data?.[0];
      console.log(socketData);
      
      setData((prevValue: any) => { 
        if (prevValue?.fairPrice) setPrevData(prevValue); 
        return socketData;
      });
    };
  };

  const arrow = useMemo(() => (data?.fairPrice > prevData?.fairPrice) ? upwardArrow : ((data?.fairPrice === prevData?.fairPrice) ? null : downwardArrow), [data]);

  return (
    <>
      <div style={{ width: '100vw', height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        { arrow }
        <Typography>
          {data?.fairPrice ? data?.fairPrice : prevData?.fairPrice}
        </Typography>
      </div>
    </>
  );
}