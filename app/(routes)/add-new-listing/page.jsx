"use client";

import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { AddressSearchMap } from "../../../components/AddressSearchMap";
import { supabase } from "../../../utils/supabse/client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function AddNewListing() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loader, setLoader] = useState(false);
  const { user } = useUser();

  const handleNextClick = async () => {
    if (selectedLocation) {
      setLoader(true);

      const { data, error } = await supabase
        .from("listing")
        .insert([
          {
            address: selectedLocation.display_name,
            coordinates: {
              lat: parseFloat(selectedLocation.lat),
              lon: parseFloat(selectedLocation.lon),
            },
            createdBy: user?.primaryEmailAddress.emailAddress,
          },
        ])
        .select();

        if(data) {
          setLoader(false);
          toast('New Address Assed for Listing')
        } 
        if(error) {
          setLoader(false);
          toast('Server Side Error')
        }

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-center">Add New Listing</h1>
            <p className="text-lg text-muted-foreground">
              Enter Address which you want to list
            </p>

            <AddressSearchMap onLocationSelect={setSelectedLocation} />

            <Button
              className="w-full bg-[#B89EFF] hover:bg-[#9F7FFF] text-white"
              disabled={!selectedLocation || loader}
              onClick={handleNextClick}
            >

              {loader ? <Loader className="animate-spin"/> : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
