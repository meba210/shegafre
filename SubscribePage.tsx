import React, { CSSProperties, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import { Enums } from '../../data_access/types';
import { Button, Input, Select, Steps, message, theme } from "antd";
// import { useOrganizationTypes } from '../../api/shared';
import { useSubscribe } from "../../api/subscribtion";
import { RegularExpression } from "../../util";
import { useGetUserByEmail, useGetUserByUserName } from "../../api/users";
import ReCAPTCHA from "react-google-recaptcha";

const wrapper: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  // gap: 10,
  alignItems: "center",
  borderBottom: "1px solid #E9EDF4 ",
};

const label: CSSProperties = {
  color: "#8A979D",
  fontFamily: "Poppins",
  fontSize: 16,
};

const value: CSSProperties = {
  fontFamily: "Poppins",
  fontSize: 16,
};

function SubscribePage() {
  const navigate = useNavigate();
  const { orgType } = useParams();
  const { mutateAsync: subscribe, isPending: subscribing } = useSubscribe();
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const [type, setType] = useState<string | undefined>();
  const [orgTypeDisabled, setOrgTypeDisabled] = useState(false);

  const [companyName, setCompanyName] = useState<string | undefined>();
  const [shortName, setShortName] = useState<string | undefined>();
  const [companyEmail, setCompanyEmail] = useState<string | undefined>();
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState<
    string | undefined
  >();
  const [region, setRegion] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [kifleKetema, setKifleKetema] = useState<string | undefined>();
  const [woreda, setWoreda] = useState<string | undefined>();
  const [kebele, setKebele] = useState<string | undefined>();
  const [houseNumber, setHouseNumber] = useState<string | undefined>();

  const [userName, setUserName] = useState<string | undefined>();
  const [fullName, setFullName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();

  const { data: userNameData, refetch: fetchUserName } =
    useGetUserByUserName(userName);
  const { data: userEmailData, refetch: fetchUserEmail } =
    useGetUserByEmail(email);

  const [hasFormError, setHasFormError] = useState(true);
  const [companyNameError, setcompanyNameError] = useState<string>();
  const [shortNameError, setShortNameError] = useState<string>();
  const [companyEmailError, setCompanyEmailError] = useState<string>();
  const [companyphoneNoError, setCompanyPhoneNoError] = useState<string>();
  const [regionError, setRegionError] = useState<string>();
  const [cityError, setCityError] = useState<string>();
  const [kifleKetemaError, setKifleKetemaError] = useState<string>();
  const [woredaError, setWoredaError] = useState<string>();
  const [kebeleError, setKebeleError] = useState<string>();
  const [houseNumberError, setHouseNumberError] = useState<string>();

  const [userNameError, setUserNameError] = useState<string>();
  const [fullNameError, setFullNameError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [phoneNumberError, setPhoneNumberError] = useState<string>();

  useEffect(() => {
    let isCompanyNameError = true;
    let isCompanyEmailError = true;
    let isCompanyPhoneNumberError = true;
    let isRegionError = true;
    let isKifleKetemaError = true;
    let isWoredaError = true;
    let isKebeleError = true;
    let isFullNameError = true;
    let isUserNameError = true;
    let isEmailError = true;
    let isPhoneNumberError = true;

    if (companyName) {
      isCompanyNameError = !RegularExpression.name.test(companyName);
      if (isCompanyNameError) {
        isCompanyNameError = true;
        setcompanyNameError("Invalid company name");
      } else {
        isCompanyNameError = false;
        setcompanyNameError(undefined);
      }
    }

    if (companyEmail) {
      isCompanyEmailError = !RegularExpression.email.test(companyEmail);
      if (isCompanyEmailError) {
        isCompanyEmailError = true;
        setCompanyEmailError("Invalid email");
      } else {
        isCompanyEmailError = false;
        setCompanyEmailError(undefined);
      }
    }

    if (companyPhoneNumber) {
      isCompanyPhoneNumberError =
        !RegularExpression.phoneNo.test(companyPhoneNumber);
      if (isCompanyPhoneNumberError) {
        isCompanyPhoneNumberError = true;
        setCompanyPhoneNoError("Invalid phone number");
      } else {
        isCompanyPhoneNumberError = false;
        setCompanyPhoneNoError(undefined);
      }
    }

    if (region) {
      isRegionError = !RegularExpression.name.test(region);
      if (isRegionError) {
        isRegionError = true;
        setRegionError("Invalid region");
      } else {
        isRegionError = false;
        setRegionError(undefined);
      }
    }

    if (kifleKetema) {
      isKifleKetemaError = !RegularExpression.name.test(kifleKetema);
      if (isKifleKetemaError) {
        isKifleKetemaError = true;
        setKifleKetemaError("Invalid kifle ketema");
      } else {
        isKifleKetemaError = false;
        setKifleKetemaError(undefined);
      }
    }

    if (woreda) {
      isWoredaError = !RegularExpression.woreda.test(woreda);
      if (isWoredaError) {
        isWoredaError = true;
        setWoredaError("Invalid woreda");
      } else {
        isWoredaError = false;
        setWoredaError(undefined);
      }
    }

    if (kebele) {
      isKebeleError = !RegularExpression.kebele.test(kebele);
      if (isKebeleError) {
        isKebeleError = true;
        setKebeleError("Invalid kebele");
      } else {
        isKebeleError = false;
        setKebeleError(undefined);
      }
    }

    if (fullName) {
      isFullNameError = !RegularExpression.name.test(fullName);
      if (isFullNameError) {
        isFullNameError = true;
        setFullNameError("Invalid name");
      } else {
        isFullNameError = false;
        setFullNameError(undefined);
      }
    }

    if (userName) {
      isUserNameError = !RegularExpression.userName.test(userName);
      if (isUserNameError) {
        isUserNameError = true;
        setUserNameError("Invalid user name");
      } else {
        isUserNameError = false;
        setUserNameError(undefined);
      }
    }

    if (email) {
      isEmailError = !RegularExpression.email.test(email);
      if (isEmailError) {
        isEmailError = true;
        setEmailError("Invalid email");
      } else {
        isEmailError = false;
        setEmailError(undefined);
      }
    }

    if (phoneNumber) {
      isPhoneNumberError = !RegularExpression.phoneNo.test(phoneNumber);
      if (isPhoneNumberError) {
        isPhoneNumberError = true;
        setPhoneNumberError("Invalid phone number");
      } else {
        isPhoneNumberError = false;
        setPhoneNumberError(undefined);
      }
    }

    setHasFormError(
      isCompanyNameError ||
        isCompanyEmailError ||
        isCompanyPhoneNumberError ||
        isRegionError ||
        isKifleKetemaError ||
        isWoredaError ||
        isKebeleError ||
        isFullNameError ||
        isUserNameError ||
        isEmailError ||
        isPhoneNumberError
    );
  }, [
    companyName,
    companyEmail,
    companyPhoneNumber,
    region,
    kifleKetema,
    woreda,
    kebele,
    fullName,
    userName,
    email,
    phoneNumber,
  ]);

  useEffect(() => {
    if (userNameData && userNameData.data && userNameData.data.data === true) {
      setUserNameError(userNameData.data.message);
    }
  }, [userNameData]);

  useEffect(() => {
    if (
      userEmailData &&
      userEmailData.data &&
      userEmailData.data.data === true
    ) {
      setEmailError(userEmailData.data.message);
    }
  }, [userEmailData]);

  useEffect(() => {
    if (orgType) {
      const _type = orgType.toUpperCase();
      if (
        _type === "MICRO-FINANCE" ||
        _type === "INSURANCE-COMPANY" ||
        _type === "OFF_TAKERS" ||
        _type === "MULTI-PURPOSE-COOPERATIVE" ||
        _type === "MACHINE_RENTER" ||
        _type === "SHEGA_FRE"
      )
        setType(_type);
      setOrgTypeDisabled(true);
    }
  }, [orgType]);

  const validateUserName = () => {
    fetchUserName();
  };

  const validateEmail = () => {
    fetchUserEmail();
  };

  const steps = [
    {
      title: "Organization",
      content: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignSelf: "center",
            width: "100%",
            height: 100,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: 20,
            }}
          >
            Company info
          </div>

          {!orgTypeDisabled && (
            <Select
              // defaultValue="lucy"
              value={type}
              className="w-full sm:w-1/2"
              disabled={orgTypeDisabled}
              onChange={(value: any) => setType(value)}
              options={[
                { label: "BANK", value: "MICRO-FINANCE" },
                { label: "INSURANCE-COMPANY", value: "INSURANCE-COMPANY" },
                { label: "OFF_TAKER", value: "OFF_TAKERS" },
                // { label: "MACHINE_RENTER", value: "MACHINE_RENTER" },
                { label: "INPUT-SUPLIER", value: "MULTI-PURPOSE-COOPERATIVE" },
              ].map((type: { label: string; value: string }) => {
                return { label: type.label, value: type.value };
              })}
            />
          )}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              {companyNameError && (
                <div className="text-red-400">{companyNameError}</div>
              )}
            </div>
            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="Enter short name"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="Enter company email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
              {companyEmailError && (
                <div className="text-red-400">{companyEmailError}</div>
              )}
            </div>
            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="Enter company phone number"
                value={companyPhoneNumber}
                onChange={(e) => setCompanyPhoneNumber(e.target.value)}
              />
              {companyphoneNoError && (
                <div className="text-red-400">{companyphoneNoError}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
              {regionError && <div className="text-red-400">{regionError}</div>}
            </div>

            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="Kifle ketema"
                value={kifleKetema}
                onChange={(e) => setKifleKetema(e.target.value)}
              />
              {kifleKetemaError && (
                <div className="text-red-400">{kifleKetemaError}</div>
              )}
            </div>
            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="woreda"
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
              />
              {woredaError && <div className="text-red-400">{woredaError}</div>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
              <Input
                placeholder="Kebele"
                value={kebele}
                onChange={(e) => setKebele(e.target.value)}
              />
              {kebeleError && <div className="text-red-400">{kebeleError}</div>}
            </div>
            <div className="flex flex-col items-start gap-4 s-full sm:w-1/2">
              <Input
                placeholder="House number"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact person",
      content: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignSelf: "center",
            height: "300px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: 20,
            }}
          >
            Contact person info
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 20,
              width: "100%",
              height: "300px",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
                <Input
                  onBlur={validateUserName}
                  placeholder="Enter user name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                {userNameError && (
                  <div className="text-red-400">{userNameError}</div>
                )}
              </div>
              <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
                <Input
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {fullNameError && (
                  <div className="text-red-400">{fullNameError}</div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
                <Input
                  onBlur={validateEmail}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <div className="text-red-400">{emailError}</div>}
              </div>
              <div className="flex flex-col items-start gap-4 w-full sm:w-1/2">
                <Input
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {phoneNumberError && (
                  <div className="text-red-400">{phoneNumberError}</div>
                )}
              </div>
            </div>
            {/* <div style={{ display: 'flex', gap: 20 }}>
                        <Input.Password placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input.Password placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div> */}
          </div>
        </div>
      ),
    },
    {
      title: "Review",
      content: (
        <div className="flex flex-col sm:flex-row gap-10 justify-center self-center">
          <div className="w-full sm:w-1/2 flex flex-col gap-3">
            <div
              style={{
                display: "flex",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: 20,
                backgroundColor: "#E9EDF4",
                padding: 6,
                borderRadius: 8,
              }}
            >
              Company Info
            </div>
            <div style={wrapper}>
              <div style={label}>Company name:</div>
              <div style={value}>{companyName}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Short name:</div>
              <div style={value}>{shortName}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Email:</div>
              <div style={value}>{companyEmail}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Phone number:</div>
              <div style={value}>{companyPhoneNumber}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Region:</div>
              <div style={value}>{region}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>City:</div>
              <div style={value}>{city}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Kifle ketema:</div>
              <div style={value}>{kifleKetema}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Woreda:</div>
              <div style={value}>{woreda}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Kebele:</div>
              <div style={value}>{kebele}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>House number:</div>
              <div style={value}>{houseNumber}</div>
            </div>
          </div>
          <div className="w-full sm:w-1/2 flex flex-col gap-3">
            <div
              style={{
                display: "flex",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: 20,
                backgroundColor: "#E9EDF4",
                padding: 6,
                borderRadius: 8,
              }}
            >
              Contact Person Info
            </div>

            <div style={wrapper}>
              <div style={label}>User name:</div>
              <div style={value}>{userName}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Full name:</div>
              <div style={value}>{fullName}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Email:</div>
              <div style={value}>{email}</div>
            </div>

            <div style={wrapper}>
              <div style={label}>Phone number:</div>
              <div style={value}>{phoneNumber}</div>
            </div>

            {/* {process.env.REACT_APP_RECAPTCHA_SITE_KEY && ( */}
            <div className="w-full h-[200px] flex justify-center items-center">
              <ReCAPTCHA
                style={{ marginTop: 20, alignItems: "center" }}
                sitekey={"6LdZRp8qAAAAAPIwhObOgWqvZidvBwilMLGPK_hw"}
                // sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={(token: any) => setRecaptchaValue(token)}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    // lineHeight: '500px',
    minHeight: 450,
    textAlign: "center",
    color: "black",
    backgroundColor: "white",
    borderTopLeftRadius: token.borderRadiusLG,
    borderTopRightRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    padding: 20,
  };

  const onSubmit = async () => {
    if (
      email &&
      companyName &&
      companyEmail &&
      companyPhoneNumber &&
      region &&
      kifleKetema &&
      woreda &&
      kebele &&
      fullName &&
      userName &&
      email &&
      type &&
      phoneNumber
    ) {
      try {
        const result = await subscribe({
          name: companyName,
          email: companyEmail,
          phoneNumber: companyPhoneNumber,
          type,
          address: JSON.stringify({
            region,
            kifleKetema,
            woreda,
            kebele,
          }),
          contactPerson: {
            fullName: fullName,
            username: userName,
            email,
            phoneNumber: phoneNumber,
          },
        });

        if (result && result.data && result.data.status === "success") {
          message.success("Subscribed successfully.");
          navigate("/");
        } else {
          message.error("Operation failed.");
        }
      } catch (err: any) {
        message.error("Operation failed.");
      }
    }
  };

  return (
    <div
      className="p-0"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "scroll",
      }}
    >
      <div className="shadow-2xl p-4 rounded-xl w-4/5 sm:w-1/2">
        <Steps current={current} items={items} />
        <div style={contentStyle} className="overflow-y-scroll">
          {steps[current].content}
        </div>
        <div className="mt-6 bg-white flex gap-6 justify-center items-center py-3">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={onSubmit}
              disabled={!recaptchaValue}
            >
              {subscribing ? "Subscribing" : "Done"}
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscribePage;
