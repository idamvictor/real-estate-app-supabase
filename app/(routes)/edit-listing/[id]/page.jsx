"use client";

import { use, useState } from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "../../../../utils/supabse/client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function EditListing({ params }) {
  const { user } = useUser();
  const router = useRouter();
  const { id } = use(params); // Unwrapping params
  const [listing, setListing] = useState([]);

  useEffect(() => {
    if (user) verifyUserRecord();
  }, [user]);

  const verifyUserRecord = async () => {
    const { data } = await supabase
      .from("listing")
      .select("*")
      .eq("createdBy", user?.primaryEmailAddress.emailAddress)
      .eq("id", id);

    if (data) {
      setListing(data[0]);
    }

    if (!data || data.length === 0) {
      router.replace("/");
    }
  };

  const onSubmitHandler = async (formvalue) => {
    const { data, error } = await supabase
      .from("listing")
      .update(formvalue)
      .eq("id", id) // Use unwrapped id
      .select();

    if (data) {
      console.log(data);
      toast("Listing updated and Published");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Formik
        initialValues={{
          type: "",
          propertyType: "",
          profileImage: user?.imageUrl,
          fullName: user?.fullName,
        }}
        onSubmit={(values) => {
          console.log(values);
          onSubmitHandler(values);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                {/* Radio group */}
                <h3 className="text-base font-medium mb-2">
                  Do you want to Rent it or Sell it?
                </h3>
                <RadioGroup
                  defaultValue={listing?.propertyType}
                  className="flex gap-4"
                  onValueChange={(v) => (values.type = v)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell">Sell</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent">Rent</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Select */}
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  name="propertyType"
                  onValueChange={(e) => (values.propertyType = e)}
                  defaultValue={listing?.propertyType}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue
                      placeholder={
                        listing?.propertyType
                          ? listing?.propertyType
                          : "Select Property Type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedroom">Bedroom</Label>
                  <Input
                    type="number"
                    id="bedroom"
                    name="bedroom"
                    onChange={handleChange}
                    defaultValue={listing?.bedroom}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathroom">Bathroom</Label>
                  <Input
                    type="number"
                    id="bathroom"
                    name="bathroom"
                    onChange={handleChange}
                    defaultValue={listing?.bathroom}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="builtin">Built In</Label>
                  <Input
                    type="number"
                    id="builtin"
                    name="builtIn"
                    onChange={handleChange}
                    defaultValue={listing?.builtIn}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parking">Parking</Label>
                  <Input
                    type="number"
                    id="parking"
                    name="parking"
                    onChange={handleChange}
                    defaultValue={listing?.parking}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lotsize">Lot Size (Sq.Ft)</Label>
                  <Input
                    type="number"
                    id="lotsize"
                    name="lotSize"
                    onChange={handleChange}
                    defaultValue={listing?.lotSize}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (Sq.Ft)</Label>
                  <Input
                    type="number"
                    id="area"
                    name="area"
                    onChange={handleChange}
                    defaultValue={listing?.area}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price ($)</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    onChange={handleChange}
                    defaultValue={listing?.price}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoa">HOA (Per Month) ($)</Label>
                  <Input
                    type="number"
                    id="hoa"
                    name="hoa"
                    onChange={handleChange}
                    defaultValue={listing?.hoa}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-[150px]"
                  name="description"
                  onChange={handleChange}
                  defaultValue={listing?.description}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Save</Button>
                <Button>Save & Publish</Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
