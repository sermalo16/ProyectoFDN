// src/pages/LoadingPage.jsx
import React from "react";
import { Spin, Typography, Progress } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "./LoadingPage.scss";

const { Title, Text } = Typography;

export default function LoadingPage({ message = "Cargando datos..." }) {
  return (
    <div className="loading-page">
      <motion.div
        className="loading-content"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          size="large"
        />
        <Title level={3} style={{ marginTop: 16 }}>
          {message}
        </Title>
        <Text type="secondary">Por favor espera un momento...</Text>

        <motion.div
          className="progress-container"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        >
          <Progress percent={100} showInfo={false} strokeWidth={6} />
        </motion.div>
      </motion.div>
    </div>
  );
}
