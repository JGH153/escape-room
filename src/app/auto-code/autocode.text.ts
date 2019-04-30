/* tslint:disable */
export const AutoText = `# Definerer input-dimensjoner
INPUT_COLUMNS = [
    tf.feature_column.numeric_column('bmi'),
    tf.feature_column.numeric_column('bp_sys'),
    tf.feature_column.numeric_column('bp_dia')
]

UNUSED_COLUMNS = set(CSV_COLUMNS) - {col.name for col in INPUT_COLUMNS} - \
    {LABEL_COLUMN}

def build_estimator(config, embedding_size=8, hidden_units=None):
  (bmi, bp_sys, bp_dia) = INPUT_COLUMNS
  
  bmi_buckets = tf.feature_column.bucketized_column(
      bmi, boundaries=[16, 18, 25, 30, 35, 40, 45, 50, 60, 70])

  wide_columns = [
      bmi_buckets,
      tf.feature_column.crossed_column(['bp_sys', 'bp_dia'], hash_bucket_size=1000)
  ]

  deep_columns = []

  # Benytter en lineær modell
  return tf.estimator.LinearClassifier(
      feature_columns=wide_columns,
      config=config)

def csv_serving_input_fn():
  csv_row = tf.placeholder(
      shape=[None],
      dtype=tf.string
  )
  features = parse_csv(csv_row)
  features.pop(LABEL_COLUMN)
  return tf.estimator.export.ServingInputReceiver(features, {'csv_row': csv_row})

def parse_csv(rows_string_tensor):
  row_columns = tf.expand_dims(rows_string_tensor, -1)
  columns = tf.decode_csv(row_columns, record_defaults=CSV_COLUMN_DEFAULTS)
  features = dict(zip(CSV_COLUMNS, columns))

  for col in UNUSED_COLUMNS:
    features.pop(col)
  return features

def input_fn(filenames,
                      num_epochs=None,
                      shuffle=True,
                      skip_header_lines=0,
                      batch_size=200):
  filename_dataset = tf.data.Dataset.from_tensor_slices(filenames)
  if shuffle:
    filename_dataset = filename_dataset.shuffle(len(filenames))
    
  dataset = filename_dataset.flat_map(
      lambda filename: tf.data.TextLineDataset(filename).skip(skip_header_lines))
  
  dataset = dataset.map(parse_csv)
  if shuffle:
    dataset = dataset.shuffle(buffer_size=batch_size * 10)
  dataset = dataset.repeat(num_epochs)
  dataset = dataset.batch(batch_size)
  iterator = dataset.make_one_shot_iterator()
  features = iterator.get_next()
  return features, parse_label_column(features.pop(LABEL_COLUMN)).

END
`;