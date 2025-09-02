import { Button, DatePicker, Divider, Input, Select, message } from "antd";
import React, { CSSProperties, useEffect, useState } from "react";
// import { useGetProductsByType, useProductTypeList } from '../../api/product';
// import { Tables } from '../../data_access/types';
import { CalendarOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useAuth } from '../../providers/AuthProvider';
import { useCreateOrder } from "../../../api/order/index";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";
import WithAuth from "../../../hoc/WithAuth";
import { useGetAllProducts } from "../../../api/product";
import { useWarehouseList } from "../../../api/admin";
import { RegularExpression } from "../../../util";
// import { useGetOffTakerByOrganizationId } from '../../api/offTaker';

interface ITag {
  key: string;
  value: string;
}

const formContainer: CSSProperties = {
  display: "flex",
  width: "100%",
  marginTop: -25,
};

const left: CSSProperties = {
  width: "40%",
};

const right: CSSProperties = {
  width: "60%",
};

const wrapper: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const label: CSSProperties = {
  fontFamily: "Poppins",
  fontSize: 15,
};

const CreateOrderPage = () => {
  const navigate = useNavigate();
  //   const { profile } = useAuth();
  //   const { data: offTaker, refetch} = useGetOffTakerByOrganizationId(profile?.organization_id || '');

  const { mutateAsync: createOrder, isPending: createPending } =
    useCreateOrder();
  const [productType, setProductType] = useState<string | undefined>();
  //   const { data: productTypesData, isLoading: isProductTypesDataLoading } = useProductTypeList();
  const [productTypes, setProductTypes] = useState<string[]>([]);
  //   const { data: products, isLoading: producstIsLoading } = useGetProductsByType(productType);

  const { data: products } = useGetAllProducts();
  const [product, setProduct] = useState<string | undefined>();
  const [location, setLocation] = useState<string>();
  const [quantity, setQuantity] = useState<string>();
  const [size, setSize] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [dueDate, setDueDate] = useState<string>();
  const [pricePerKg, setPricePerKg] = useState<string>();

  const [hasFormError, setHasFormError] = useState(true);
  const [productError, setProductError] = useState<string>();
  const [locationError, setLocationError] = useState<string>();
  const [quantityError, setQuantityError] = useState<string>();
  const [startDateError, setStartDateError] = useState<string>();
  const [dueDateError, setDueDateError] = useState<string>();

  const [tags, setTags] = useState<ITag[]>([]);
  const [tagKey, setTagKey] = useState<string>();
  const [tagValue, setTagValue] = useState<string>();
  const [productNames, setProductNames] = useState<
    { name: string; id: number; category: string }[]
  >([]);

  const { data: warehouses, isLoading } = useWarehouseList();

  useEffect(() => {
    if (products && products.data && products.data.productItemDtos) {
      const types = products.data.productItemDtos.map((p: any) => p.category);
      if (types) {
        setProductTypes(Array.from(new Set(types)));
      }
    }
  }, [products]);

  useEffect(() => {
    if (
      productType &&
      products &&
      products.data &&
      products.data.productItemDtos
    ) {
      const _selectedProducts = products.data.productItemDtos.filter(
        (item: any) => item.category === productType,
      );
      setProductNames(_selectedProducts);
    }
  }, [productType]);

  useEffect(() => {
    let isQuanityError = true;

    if (quantity) {
      isQuanityError = !RegularExpression.quantity.test(quantity);
      if (isQuanityError) {
        isQuanityError = true;
        setQuantityError("Invalid quantity");
      } else {
        isQuanityError = false;
        setQuantityError(undefined);
      }
    }

    setHasFormError(isQuanityError);
  }, [quantity]);

  useEffect(() => {
    if (product) {
      setProductError(undefined);
    } else {
      setProductError("Invalid product");
    }
  }, [product]);

  useEffect(() => {
    if (location) {
      setLocationError(undefined);
    } else {
      setLocationError("Invalid location");
    }
  }, [location]);

  const handleInsertTag = () => {
    if (tagKey && tagValue) {
      const _tag = tags.find((tag) => tag.key === tagKey);

      if (!_tag) {
        setTags((prev) => [...prev, { key: tagKey, value: tagValue }]);
        setTagKey(undefined);
        setTagValue(undefined);
      }
    }
  };

  const handleRemoveTag = (key: string) => {
    if (key) {
      const _tags = tags.filter((tag) => tag.key !== key);
      setTags(_tags);
    }
  };

  const onSubmit = async () => {
    try {
      const _tags = tags.reduce((acc, tag) => {
        return { ...acc, ...(tag.key ? { [tag.key]: tag.value } : tag) };
      }, {});
      if (location && quantity && product && startDate && dueDate) {
        const order = {
          location,
          quantity: Number(quantity),
          product_id: product,
          starting_date: startDate,
          due_date: dueDate,
          status: "PENDING",
          tags: JSON.stringify(_tags),
        };

        const result = await createOrder(order);

        if (result.data.data.id) {
          message.success("Order created successfully.");
          navigate("/my-orders");
        } else {
          message.error("Operation failed.");
        }
      }
    } catch (err: any) {
      message.error("Operation failed.");
    }
  };

  return (
    <div
      className="px-4 md:px-[75px]"
      style={{
        fontFamily: "Poppins",
        borderRadius: 8.5,
        marginTop: 25,
        backgroundColor: "white",
        paddingTop: 28,
        paddingBottom: 28,
      }}
    >
      <div
        style={{
          fontFamily: "Poppins",
          fontSize: 16,
          borderBottom: "1px solid #DCE2E4",
          paddingBottom: 10,
          marginBottom: 40,
        }}
      >
        What do you want to order?
      </div>
      <div
        className="flex-col gap-6 md:flex-row md:gap-[120px]"
        style={formContainer}
      >
        <div className="w-full md:w-[40%]">
          <div className="flex flex-col gap-2 md:flex-row w-full md:gap-[12px]">
            <div
              className="w-full mt-2 gap-1 md:w-1/2 md:mt-[25px] md:gap-[10px]"
              style={{ ...wrapper }}
            >
              <div style={label}>Product Type</div>
              <Select
                placeholder="Select product type"
                value={productType}
                onChange={(val: any) => setProductType(val)}
                options={productTypes.map((product: string) => {
                  return { label: product, value: product };
                })}
              />
            </div>

            <div
              className="w-full mt-2 gap-1 md:w-1/2 md:mt-[25px] md:gap-[10px]"
              style={{ ...wrapper }}
            >
              <div style={label}>Product</div>
              <Select
                disabled={productType === undefined}
                placeholder="Select product"
                value={product}
                onChange={(val: any) => setProduct(val)}
                options={productNames.map((p: any) => {
                  return { label: p.name, value: p.id, key: p.id };
                })}
              />
            </div>
          </div>

          <div
            className="w-full mt-4 md:w-1/2 md:mt-[25px] md:gap-[10px]"
            style={{ ...wrapper }}
          >
            <div style={label}>Location</div>
            <Select
              loading={isLoading}
              placeholder="Select location"
              value={location}
              onChange={(val: any) => setLocation(val)}
              options={warehouses?.data.data.map((p: any) => {
                return {
                  label: p.centerName,
                  value: p.id.toString(),
                  key: p.id,
                };
              })}
            />
          </div>

          <div
            className="w-full mt-4 gap-1 md:w-1/2 md:mt-[25px] md:gap-[10px]"
            style={{ ...wrapper }}
          >
            <div style={label}>Product quantity (qt)</div>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Insert product quantity"
              addonBefore={
                <svg
                  fill="#009602"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  viewBox="0 0 100 100"
                  enable-background="new 0 0 100 100"
                >
                  <g>
                    <path
                      d="M25.8,60.6h-4.5c-0.7,0-1.3,0.6-1.3,1.3v16.1c0,0.7,0.6,1.3,1.3,1.3h2.2c2,0,3.6-1.6,3.6-3.6V62
		C27.2,61.2,26.5,60.6,25.8,60.6z"
                    />
                    <path
                      d="M79.9,69.4c-0.7-1.6-2-3.3-3.9-3.5c-1-0.1-2,0.3-2.9,0.6c-3.6,1.3-7.2,2.5-10.8,3.8
		c-2.3,0.8-4.7,1.6-7.2,1.8c-1.7,0.1-3.4,0-5.1,0c-0.9,0-1.7-0.7-1.7-1.7s0.7-1.7,1.7-1.7l9.1,0c1.7,0,3-1.4,3-3s-1.4-3-3-3h-7
		c-0.3,0-2.2-0.1-3.4-0.6c-1.3-0.6-3-0.7-3-0.6c0,0,0,0-0.1,0H33.4c-1.5,0-2.7,1.2-2.7,2.7v11.3c0,1.3,1,2.4,2.3,2.6
		c0.1,0,0.2,0,0.3,0c2.3,0,4.6,0.5,6.9,0.9c2.3,0.5,4.5,0.8,6.9,0.8c3,0.1,6.1-0.4,9-1.1c2.9-0.8,5.7-1.9,8.5-2.8
		c4.8-1.6,9.7-3.3,14.5-4.9C79.7,70.7,80.2,70.2,79.9,69.4z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M58,40.1v15c0,0.5,0.5,0.7,0.9,0.6c2.9-1.7,11.9-6.7,11.9-6.7
		c1.2-0.7,1.9-1.9,1.9-3.3V32.2c0-0.5-0.5-0.7-0.9-0.6l-13.2,7.4C58.3,39.3,58,39.7,58,40.1"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M56.8,36L70,28.6c0.4-0.2,0.4-0.8,0-1c-2.9-1.7-12-6.8-12-6.8
		c-1.2-0.7-2.6-0.7-3.8,0c0,0-9,5.1-12,6.8c-0.4,0.2-0.4,0.8,0,1L55.6,36C55.9,36.2,56.4,36.2,56.8,36"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M53.7,39.1l-13.2-7.4c-0.4-0.2-0.9,0.1-0.9,0.6v13.4
		c0,1.3,0.7,2.6,1.9,3.3c0,0,9,5.1,11.9,6.7c0.4,0.2,0.9-0.1,0.9-0.6V40.1C54.3,39.7,54.1,39.3,53.7,39.1"
                    />
                  </g>
                </svg>
              }
            />
            {quantityError && (
              <div className="text-red-400">{quantityError}</div>
            )}
          </div>
        </div>
        <div className="w-full md:w-[60%]">
          <div
            className="md:mt-[25px]"
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div
              className="sm:w-full border-b-[1px] md:b-0 pb-2 border-[#E6EEF6] md:b-0"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <CalendarOutlined style={{ color: "#009602", fontSize: 30 }} />
              <div style={{ fontFamily: "Poppins", fontSize: 15 }}>
                Delivery dates
              </div>
            </div>
            <div
              className="flex-col md:flex-row md:px-[50px] md:border-[1px] md:border-[#E6EEF6]"
              style={{
                display: "flex",
                borderRadius: 4,
                gap: 12,
                paddingTop: 0,
                paddingBottom: 20,
              }}
            >
              <div
                className="w-full mt-2 gap-1 md:w-1/2 md:mt-[15px] md:gap-[10px]"
                style={{ ...wrapper }}
              >
                <div style={label}>Start date</div>
                <DatePicker
                  onChange={(_, dateString) => {
                    const [year, month, date] = (dateString as string).split(
                      "-",
                    );
                    setStartDate(`${date}/${month}/${year}`);
                  }}
                />
              </div>
              <div
                className="w-full mt-2 gap-1 md:w-1/2 md:mt-[15px] md:gap-[10px]"
                style={{ ...wrapper }}
              >
                <div style={label}>Due date</div>
                <DatePicker
                  onChange={(d, dateString) => {
                    const [year, month, date] = (dateString as string).split(
                      "-",
                    );
                    setDueDate(`${date}/${month}/${year}`);
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="mt-2 md:mt-[25px]"
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div
              className="border-b-[1px] border-[#E6EEF6] pb-2 md:border-0 md:pb-0"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.0498 7.0498H7.0598M10.5118 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V10.5118C3 11.2455 3 11.6124 3.08289 11.9577C3.15638 12.2638 3.27759 12.5564 3.44208 12.8249C3.6276 13.1276 3.88703 13.387 4.40589 13.9059L9.10589 18.6059C10.2939 19.7939 10.888 20.388 11.5729 20.6105C12.1755 20.8063 12.8245 20.8063 13.4271 20.6105C14.112 20.388 14.7061 19.7939 15.8941 18.6059L18.6059 15.8941C19.7939 14.7061 20.388 14.112 20.6105 13.4271C20.8063 12.8245 20.8063 12.1755 20.6105 11.5729C20.388 10.888 19.7939 10.2939 18.6059 9.10589L13.9059 4.40589C13.387 3.88703 13.1276 3.6276 12.8249 3.44208C12.5564 3.27759 12.2638 3.15638 11.9577 3.08289C11.6124 3 11.2455 3 10.5118 3ZM7.5498 7.0498C7.5498 7.32595 7.32595 7.5498 7.0498 7.5498C6.77366 7.5498 6.5498 7.32595 6.5498 7.0498C6.5498 6.77366 6.77366 6.5498 7.0498 6.5498C7.32595 6.5498 7.5498 6.77366 7.5498 7.0498Z"
                  stroke="#009602"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div style={{ fontFamily: "Poppins", fontSize: 15 }}>Tags</div>
            </div>
            <div
              className="border-0 md:border-[1px] md:px-[50px]"
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                gap: 12,
                paddingTop: 0,
                paddingBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  marginTop: -10,
                }}
              >
                {tags &&
                  tags.map((tag) => (
                    <div
                      key={tag.key}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #DCE2E4",
                        paddingTop: 20,
                        paddingBottom: 5,
                      }}
                    >
                      <div>{tag.key}</div>
                      <div>
                        {tag.value}{" "}
                        <DeleteOutlined
                          style={{ color: "red" }}
                          onClick={() => handleRemoveTag(tag.key)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                  width: "100%",
                }}
              >
                <div style={{ ...wrapper, width: "50%", marginTop: 15 }}>
                  <div style={label}>Key</div>
                  <Input
                    value={tagKey}
                    onChange={(e) => setTagKey(e.target.value)}
                    placeholder="Insert key"
                  />
                </div>

                <div style={{ ...wrapper, width: "50%", marginTop: 15 }}>
                  <div style={label}>Value</div>
                  <Input
                    value={tagValue}
                    onChange={(e) => setTagValue(e.target.value)}
                    placeholder="Insert value"
                  />
                </div>
              </div>
              <Button className="w-full md:w-[150px]" onClick={handleInsertTag}>
                Add new tag
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}
      >
        <Button
          type="primary"
          className="w-full md:w-[200px]"
          onClick={onSubmit}
          disabled={
            hasFormError || product === undefined || location === undefined
          }
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default WithAuth(CreateOrderPage);
