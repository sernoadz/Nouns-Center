import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Title from "./components/Title";
import "react-notion/src/styles.css";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import { v4 as uuidv4 } from "uuid";
import { NotionRenderer } from "react-notion";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const oniNotionTable = "e29fc3a9-2c4a-44c9-8210-f5142b751502";
const rootNotionPageId = "e29fc3a92c4a44c98210f5142b751502"; // collection

export async function getStaticProps() {
  const ids = await fetch(
    `https://notion-api.splitbee.io/v1/table/${oniNotionTable}`
  ).then((res) => res.json());

  return {
    props: {
      tableIds: ids,
    },
  };
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Notes = ({ tableIds }) => {
  const [currentPostId, setCurrentPostId] = useState(rootNotionPageId);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    tableIds &&
      tableIds.map((post, idx) => {
        if (idx === 0) {
          setCurrentPostId(post.id);
          return { ...post, current: true };
        } else {
          return { ...post, current: false };
        }
      });
  }, []);

  useEffect(() => {
    const data = fetch(
      `https://notion-api.splitbee.io/v1/page/${currentPostId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPostData(data);
      });
  }, [currentPostId]);

  const getWeekName = (id: any) => {
    return id.Name.substring(0, 5);
  };

  const currentId = tableIds?.find((t) => t.id === currentPostId)!;

  return (
    <>
      <Header title="Notes | Nouns Center" />
      <Menu as="div" className="relative w-full inline-block text-left">
        <div className="flex justify-between ">
          <Title title="Notes" />
          <div className="">
            <Menu.Button className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              {currentId ? getWeekName(currentId) : "Week"}
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {tableIds &&
                tableIds.map((id) => (
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        key={id.Name}
                        onClick={() => setCurrentPostId(id.id)}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {getWeekName(id)}
                      </div>
                    )}
                  </Menu.Item>
                ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      {/* Week of {week !== "" && postData.Name} */}
      {postData && (
        <div className="text-white">
          <NotionRenderer blockMap={postData} />
        </div>
      )}
    </>
  );
};

export default Notes;