"use client";

import {
  Box,
  TextField,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Button,
  Container,
  Divider,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Receipt {
  receiptTotal: string;
  restaurant: string;
  boughtBy: string;
  paymentOption: string;
}

export default function Home() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      receiptTotal: "",
      restaurant: "",
      boughtBy: "e",
      paymentOption: "50",
    },
  });

  const onSubmit: SubmitHandler<Receipt> = (data) => {
    setReceipts([...receipts, data]);
    reset();
  };

  const renderReceiptList = (receipts: Receipt[], title: string) => (
    <Box flex="1">
      <Typography variant="h4" component="h2">
        {title}
      </Typography>
      <List>
        {receipts.map((receipt, index) => (
          <ListItem key={index}>
            {receipt.restaurant} {receipt.receiptTotal}kr -{" "}
            {receipt.paymentOption}%
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const getTotalPaid = (person: string) =>
    receipts
      .filter((receipt) => receipt.boughtBy === person)
      .reduce(
        (total, receipt) =>
          total +
          (parseInt(receipt.receiptTotal) * parseInt(receipt.paymentOption)) /
            100,
        0
      );

  const total = {
    e: getTotalPaid("e"),
    l: getTotalPaid("l"),
  };

  return (
    <Container component="main" maxWidth="md" sx={{ paddingY: 2 }}>
      <Typography variant="h3" component="h1">
        Receipt Vault
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={2} marginY={4}>
          <Controller
            name="receiptTotal"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                id="receipt-total"
                label="Receipt total"
                variant="outlined"
                type="number"
                {...field}
              />
            )}
          />

          <Controller
            name="restaurant"
            control={control}
            render={({ field }) => (
              <TextField
                id="restaurant"
                label="Restaurant"
                variant="outlined"
                {...field}
              />
            )}
          />

          <Box display="flex" gap={4}>
            <Controller
              name="boughtBy"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormLabel id="receipt-bought-by-label">
                    Receipt bought by
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="receipt-bought-by-label"
                    defaultValue="e"
                    {...field}
                  >
                    <FormControlLabel value="e" control={<Radio />} label="E" />
                    <FormControlLabel value="l" control={<Radio />} label="L" />
                  </RadioGroup>
                </Box>
              )}
            />
            <Controller
              name="paymentOption"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormLabel id="payment-option-label">
                    Payment option
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="payment-option-label"
                    defaultValue="50"
                    {...field}
                  >
                    <FormControlLabel
                      value="50"
                      control={<Radio />}
                      label="50%"
                    />
                    <FormControlLabel
                      value="100"
                      control={<Radio />}
                      label="100%"
                    />
                  </RadioGroup>
                </Box>
              )}
            />
          </Box>

          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </form>

      {total.e > 0 || total.l > 0 ? (
        <>
          <Box display="flex" gap={4} marginY={4}>
            {renderReceiptList(
              receipts.filter((receipt) => receipt.boughtBy === "e"),
              "E"
            )}
            <Divider orientation="vertical" variant="middle" flexItem />
            {renderReceiptList(
              receipts.filter((receipt) => receipt.boughtBy === "l"),
              "L"
            )}
          </Box>

          <Typography variant="h4" component="span">
            {total.e > total.l ? "E" : "L"} is expected to receive{" "}
            <Typography
              variant="h4"
              component="span"
              sx={{ textDecoration: "underline" }}
            >
              {Math.abs(total.e - total.l)}kr
            </Typography>
          </Typography>
        </>
      ) : null}
    </Container>
  );
}
