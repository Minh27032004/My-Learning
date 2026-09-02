/* Mảng 07 — AI / Machine Learning
   Xem docs/them-cong-nghe-moi.md để biết cách thêm mảng mới. */
window.CURRICULUM.push(
{
  "id": "07",
  "kind": "lo-trinh",
  "title": "AI / Machine Learning",
  "tag": "Đích đến — nhưng đi từ gốc",
  "color": "#a8e04a",
  "why": "Cám dỗ lớn nhất là nhảy thẳng vào LLM API. Làm vậy bạn thành người gọi API, không phải kỹ sư AI. Toán nền và ML cổ điển là thứ giúp bạn biết vì sao model sai, chứ không chỉ biết nó sai.",
  "folder": "https://github.com/Minh27032004/My-Learning/blob/main/roadmap/07-ai-ml.md",
  "page": null,
  "pageLabel": null,
  "prompts": {
    "lesson": "Ưu tiên trực giác trước công thức. Khi buộc phải có công thức, giải thích từng ký hiệu nghĩa là gì. Ví dụ code bằng PyTorch hoặc scikit-learn.",
    "quiz": "Ưu tiên câu hỏi về trực giác toán học và lý do thiết kế. Không hỏi thuộc lòng công thức. Dạng tốt: 'nếu tăng tham số này thì điều gì xảy ra', 'vì sao kiến trúc này dùng X thay vì Y'."
  },
  "modules": [
    {
      "name": "Công cụ & Python cho data",
      "items": [
        "NumPy: ndarray, broadcasting, vector hoá",
        "pandas: DataFrame, groupby, merge, xử lý thiếu dữ liệu",
        "matplotlib / seaborn để trực quan hoá",
        "Jupyter notebook và thói quen dùng đúng cách",
        "Quản lý môi trường và tái lập kết quả (seed)"
      ]
    },
    {
      "name": "Toán nền tảng",
      "items": [
        "Vector, ma trận, phép nhân ma trận",
        "Chuẩn (norm), tích vô hướng, độ tương đồng cosine",
        "Trị riêng, vector riêng, SVD (trực giác)",
        "Đạo hàm, gradient, quy tắc chuỗi",
        "Gradient descent hoạt động thế nào",
        "Xác suất, Bayes, phân phối thường gặp",
        "Kỳ vọng, phương sai, định lý giới hạn trung tâm",
        "Kiểm định giả thuyết, p-value, khoảng tin cậy"
      ]
    },
    {
      "name": "Machine Learning cổ điển",
      "items": [
        "Học có giám sát vs không giám sát vs tăng cường",
        "Chia train / validation / test đúng cách",
        "Overfitting, underfitting, đánh đổi bias-variance",
        "Cross-validation",
        "Chuẩn hoá đặc trưng và rò rỉ dữ liệu (data leakage)",
        "Hồi quy tuyến tính và hồi quy logistic",
        "Cây quyết định và random forest",
        "Gradient boosting: XGBoost, LightGBM",
        "SVM, KNN, Naive Bayes",
        "K-means và phân cụm phân cấp",
        "PCA và giảm chiều",
        "Metric: accuracy, precision, recall, F1, ROC-AUC",
        "Ma trận nhầm lẫn và dữ liệu mất cân bằng",
        "Feature engineering",
        "scikit-learn pipeline và tinh chỉnh siêu tham số"
      ]
    },
    {
      "name": "Deep Learning",
      "items": [
        "Neuron, tầng, hàm kích hoạt",
        "Lan truyền tiến và lan truyền ngược",
        "Hàm mất mát cho hồi quy và phân loại",
        "Optimizer: SGD, Momentum, Adam",
        "Batch, epoch, learning rate schedule",
        "Regularization: dropout, weight decay, early stopping",
        "Batch normalization",
        "CNN: convolution, pooling, kiến trúc kinh điển",
        "RNN, LSTM, GRU và vấn đề gradient tiêu biến",
        "Transfer learning và fine-tuning",
        "PyTorch: tensor, autograd, nn.Module, vòng lặp huấn luyện",
        "Huấn luyện trên GPU và mixed precision"
      ]
    },
    {
      "name": "NLP & Transformer",
      "items": [
        "Tokenization: word, subword, BPE",
        "Embedding: word2vec, GloVe",
        "Cơ chế attention",
        "Self-attention và multi-head attention",
        "Kiến trúc Transformer đầy đủ",
        "Positional encoding",
        "BERT (encoder) vs GPT (decoder)",
        "HuggingFace transformers và datasets",
        "Đọc hiểu paper Attention Is All You Need"
      ]
    },
    {
      "name": "LLM Engineering",
      "items": [
        "Cách LLM sinh token, temperature, top-p",
        "Context window và quản lý ngữ cảnh",
        "Gọi API Claude / OpenAI / Gemini",
        "Prompt engineering: few-shot, chain-of-thought",
        "Structured output và JSON schema",
        "Function calling / tool use",
        "Streaming và xử lý lỗi, retry",
        "Đánh giá LLM: benchmark, LLM-as-judge",
        "Kiểm soát chi phí và token"
      ]
    },
    {
      "name": "RAG & Vector DB",
      "items": [
        "Vì sao cần RAG thay vì nhồi hết vào prompt",
        "Kiến trúc: ingest → chunk → embed → index → retrieve → generate",
        "Chiến lược chia đoạn (chunking) và overlap",
        "Chọn model embedding",
        "Vector database và chỉ mục ANN",
        "Hybrid search: kết hợp BM25 và vector",
        "Reranking (cross-encoder)",
        "Đánh giá RAG: recall, precision, faithfulness",
        "Xử lý tài liệu PDF, bảng, hình"
      ]
    },
    {
      "name": "AI Agents",
      "items": [
        "Agent là gì: vòng lặp quan sát → suy nghĩ → hành động",
        "ReAct và tool use",
        "Bộ nhớ ngắn hạn và dài hạn của agent",
        "Lập kế hoạch và phân rã nhiệm vụ",
        "Model Context Protocol (MCP)",
        "Hệ đa agent và điều phối",
        "Đánh giá và bảo vệ agent (guardrail)",
        "Framework: LangGraph, Claude Agent SDK"
      ]
    },
    {
      "name": "Fine-tuning & tối ưu",
      "items": [
        "Cây quyết định: prompt vs RAG vs fine-tune",
        "Chuẩn bị dataset huấn luyện",
        "LoRA và QLoRA",
        "PEFT và adapter",
        "RLHF, DPO (hiểu ý tưởng)",
        "Lượng tử hoá: INT8, INT4",
        "Distillation"
      ]
    },
    {
      "name": "MLOps & hệ thống AI",
      "items": [
        "Theo dõi thí nghiệm: MLflow, Weights & Biases",
        "Version dữ liệu với DVC",
        "Model registry và versioning",
        "Serving: vLLM, TorchServe, ONNX Runtime",
        "Giám sát drift dữ liệu và chất lượng model",
        "CI/CD cho pipeline ML",
        "Kiến trúc hệ thống AI end-to-end",
        "Đạo đức AI, bias, và quyền riêng tư dữ liệu"
      ]
    }
  ]
}
);
