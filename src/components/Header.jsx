import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link,useNavigate,createSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { signOutWithFirebase } from "../utility/utils";
import { useDispatch } from "react-redux";
import { updateSearchValue } from "../features/searchValueSlice";
import { getDataFromFirebase } from "../utility/utils";
import { useEffect } from "react";
import { getProductsParams } from "../utility/utils";
import { navigationRoutes } from "../utility/constants";
import SearchComponent from "./SearchComponent";
import CategoryDropDown from "./CategoryDropDown";
import { updateProductsData } from "../features/productsSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const authData = useSelector((state) => state.authData);
  const addToCart = useSelector((state) => state.addToCart.value);
  const [categoryArr, setCategoryArr] = useState();
  const [allCategories,setAllCategories] = useState();
  const handleCategory = (category,subCategory) => {
    navigate({
      pathname: "/products",
      search: createSearchParams({
        category,
        "sub-category": subCategory,
      }).toString(),
    });
  };

  useEffect(() => {
    // !Note: In production we do not get all the data at once, this implementation is for the current project only
    getDataFromFirebase("products")
      .then((data) => {
        const { category,categories } = getProductsParams(data);
        dispatch(updateProductsData(data));
        setCategoryArr(category);
        setAllCategories(categories);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(updateSearchValue(searchValue));
  };

  return (
    <>
      <>
        <div className="w-full px-2 sm:px-6 md:px-8 bg-gray-800">
          <div className="relative flex h-16 items-center justify-between">
            <SearchComponent
              {...{
                searchValue,
                setSearchValue,
                handleSearch
              }}
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 mr-3 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <Link to={`/Cart`}>
                <button
                  type="button"
                  className="relative rounded-full flex bg-gray-800 p-1 mr-3 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Cart</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {addToCart.length}
                </button>
              </Link>

              {authData.isLoggedIn ? (
                <Link
                  to="/"
                  onClick={signOutWithFirebase}
                  className="flex bg-gray-800 p-1 mr-3 text-gray-400 hover:text-white"
                >
                  <UserIcon className="h-6 w-6 me-1" />
                  <span>Sign Out</span>
                </Link>
              ) : (
                <Link
                  to="/signin"
                  className="flex bg-gray-800 p-1 mr-3 text-gray-400 hover:text-white"
                >
                  <UserIcon className="h-6 w-6 me-1" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </Menu.Button>
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <Disclosure as="nav" className="bg-gray-800">
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigationRoutes.map((item) => (
                <Disclosure.Button key={item.name} as="a" href={item.href}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </Disclosure>
      </>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 md:px-8">
              <div className="relative flex h-10 items-center justify-between">
                <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {
                        categoryArr?.map((category,index)=>{
                          return <CategoryDropDown handleCategory={handleCategory} category={category} subCategory={allCategories[category]} key={index}/>
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigationRoutes.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
