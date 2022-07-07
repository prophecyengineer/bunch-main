import { TabsProps, Tabs, Modal } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import {
  Photo,
  Bell,
  CirclePlus,
  Search,
  Home2,
  UserCircle,
} from "tabler-icons-react";
import router, { useRouter } from "next/router";
import Post from "../../post";

const activeTab = () => {
  if (window?.location?.pathname?.includes("/home")) {
    return 0;
  }
  if (window?.location?.pathname?.includes("/explore")) {
    return 1;
  }
  if (window?.location?.pathname?.includes("/post")) {
    return 2;
  }
  if (window?.location?.pathname?.includes("/profile")) {
    return 3;
  }
};

function Thumb() {
  const router = useRouter();

  return (
    <>
      <Tabs
        initialTab={activeTab()}
        onTabChange={(_, key) => {
          console.log("key", key);
          router.push("/" + key);
        }}
        grow
        variant="pills"
      >
        {/* <Link href="/home"> */}
        <Tabs.Tab tabKey="home" icon={<Home2 size={14} />}></Tabs.Tab>
        <Tabs.Tab tabKey="explore" icon={<Search size={14} />}></Tabs.Tab>

        <Tabs.Tab tabKey="post" icon={<CirclePlus size={14} />}></Tabs.Tab>
        <Tabs.Tab tabKey="notification" icon={<Bell size={14} />}></Tabs.Tab>
        <Tabs.Tab tabKey="profile" icon={<UserCircle size={14} />}></Tabs.Tab>
      </Tabs>
    </>
  );
}

export default Thumb;
