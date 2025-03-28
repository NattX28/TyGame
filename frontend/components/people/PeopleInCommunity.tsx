"use client";
import { CommunityMember, User } from "@/types/types";
import Person from "./Person";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCommunityMember } from "@/services/community/communities";
import { getUserData } from "@/services/user/user";

const PeopleInCommunity = () => {
  const idCommunity = useParams().id as string;
  if (!idCommunity) return

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [people, setPeople] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCommunityMembers = async () => {
      try {
        const userIds = await getCommunityMember(idCommunity);
        const users = await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userData = await getUserData(userId)
              return userData
            } catch (error) {
              console.error("Error fetching user data:", error);
              return null
            }
          })
        );

        let filteredUsers = users.filter((user): user is User => user !== null);
        setPeople(filteredUsers);
      } catch (error) {
        console.log("Error fetching community members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityMembers();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {people.map((person) => {
            const isOwnProfile = user.userid === person.id;
            const link_profile = isOwnProfile ? "/profile" : `/profile/${person.id}`;
            
            return (
              <li key={person.id}>
                <Person person={person} linkProfile={link_profile} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default PeopleInCommunity;
