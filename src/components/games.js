import React, { useEffect, useState } from "react";
import { db } from "../firebase.js"; // Import Firestore config
import { collection, getDocs } from "firebase/firestore";
import formatDateFromMilliseconds from "../util/DateConverter.js";

const FirestoreGames = () => {
  const [users, setUsers] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);

        usersSnapshot.forEach(async (userDoc) => {
          const userGames = [];
          const gamesCollectionRef = collection(userDoc.ref, "games");
          const gamesSnapshot = await getDocs(gamesCollectionRef);
          setUsers((prevUsers) => ({
            ...prevUsers,
            [userDoc.id]: userDoc.data(),
          }));

          gamesSnapshot.forEach((gameDoc) => {
            userGames.push({
              id: gameDoc.id,
              ...gameDoc.data(),
              userId: userDoc.id,
            });
          });
          setData((prevData) => ({
            ...prevData,
            [userDoc.id]: userGames,
          }));
        });
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div>
      <h1>Data List</h1>
      <ul>
        {Object.keys(data).map((userId) => {
          return (
            <li key={userId}>
              <h2>Name: {users[userId].name}</h2>
              <ul>
                {data[userId].map((game) => {
                  return (
                    <li>
                      <p>Game Name: {game.title}</p>
                      <p>
                        Game Created Date:{" "}
                        {formatDateFromMilliseconds(game.gameDate)}
                      </p>
                      <p>Holes:</p>
                      <li>
                        <ul>
                          {game.holes.map((hole) => {
                            return (
                              <li>
                                <p>Par: {hole.par}</p>
                                <p>Yardage: {hole.yardage}</p>
                                <p>Score: {hole.score}</p>
                                <h1>Tee Shot</h1>
                                <p>Club: {hole.club}</p>
                                <p>Fairway: {hole.fairway ? "Yes" : "No"}</p>
                                <p>Miss: {hole.missTee}</p>
                                <h1>Approach</h1>
                                <p>Club Hit: {hole.clubHit}</p>
                                <p>
                                  Green in Regulation: {hole.gir ? "Yes" : "No"}
                                </p>
                                <p>Miss: {hole.missApproach}</p>
                                <h1>Short Game</h1>
                                <p>
                                  Up and Down: {hole.upAndDown ? "Yes" : "No"}
                                </p>
                                <h1>Putts</h1>
                                <p>Total Putts: {hole.totalPutts}</p>
                                <p>First Putt Distance: {hole.firstPuttDist}</p>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FirestoreGames;
